from flask import Flask, render_template, jsonify, request
from flask_pymongo import PyMongo
from flask_cors import CORS
import os
import pickle
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
import nltk
from nltk.stem.porter import PorterStemmer
from bson import ObjectId
import datetime
import math

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend integration

# Configure MongoDB URI
app.config["MONGO_URI"] = "mongodb://localhost:27017/LMS"
mongo = PyMongo(app)

# Initialize Porter Stemmer
ps = PorterStemmer()

# Download necessary NLTK packages 
nltk.download('punkt', quiet=True)

# Helper functions
def preprocess_text(text):
    """Preprocess text by tokenizing, lowercasing, and stemming"""
    if not isinstance(text, str):
        text = str(text)
    tokens = nltk.word_tokenize(text.lower())
    stemmed_tokens = [ps.stem(word) for word in tokens if word.isalnum()]
    return ' '.join(stemmed_tokens)

def combine_course_features(course):
    """Combine multiple course features into a single text for vectorization"""
    features = [
        course.get('title', ''),
        course.get('subtitle', ''),
        course.get('description', ''),
        course.get('category', ''),
        course.get('objectives', ''),
        course.get('welcomeMessage', '')
    ]
    return ' '.join([str(feature) for feature in features if feature])

def build_recommendation_model():
    """Build and return TF-IDF vectorizer and course data"""
    courses = list(mongo.db.courses.find())
    
    # If no courses, return empty model
    if not courses:
        empty_df = pd.DataFrame()
        empty_vectorizer = TfidfVectorizer()
        empty_vectors = empty_vectorizer.fit_transform([])
        return empty_vectorizer, empty_df, empty_vectors
    
    # Convert MongoDB cursor to DataFrame
    courses_df = pd.DataFrame(courses)
    
    # Create a new column that combines important text fields
    courses_df['combined_text'] = courses_df.apply(combine_course_features, axis=1)
    
    # Preprocess the combined text
    courses_df['processed_text'] = courses_df['combined_text'].apply(preprocess_text)
    
    # Vectorize the text
    vectorizer = TfidfVectorizer(max_features=5000)
    vectors = vectorizer.fit_transform(courses_df['processed_text'])
    
    print(f"Recommendation model built with {len(courses_df)} courses")
    return vectorizer, courses_df, vectors

# Get dummy rating and duration for demo purposes
def get_dummy_metadata(course_id):
    """Generate consistent dummy metadata for courses that lack it"""
    # Use course_id to generate consistent random values
    if isinstance(course_id, ObjectId):
        seed = int(str(course_id)[-6:], 16)
    else:
        seed = hash(str(course_id)) % 10000
    
    np.random.seed(seed)
    
    rating = round(3.5 + np.random.random() * 1.5, 1)  # Rating between 3.5 and 5.0
    rating_count = np.random.randint(10, 1000)
    duration = np.random.randint(1, 40)  # Duration in hours
    
    return {
        'rating': rating,
        'ratingCount': rating_count,
        'duration': duration
    }

# Build the recommendation model
try:
    vectorizer, courses_df, course_vectors = build_recommendation_model()
except Exception as e:
    print(f"Error building recommendation model: {str(e)}")
    # Initialize with empty values
    empty_df = pd.DataFrame()
    empty_vectorizer = TfidfVectorizer()
    empty_vectors = empty_vectorizer.fit_transform([])
    vectorizer, courses_df, course_vectors = empty_vectorizer, empty_df, empty_vectors

@app.route("/")
def index():
    return render_template("index.html")

@app.after_request
def after_request(response):
    """Add CORS headers to all responses"""
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

@app.route("/api/health", methods=["GET"])
def health_check():
    """API health check endpoint"""
    return jsonify({"status": "ok", "server_time": datetime.datetime.now().isoformat()}), 200

@app.route("/api/courses", methods=["GET"])
def get_courses():
    try:
        # Get pagination parameters
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 10))
        
        # Calculate skip
        skip = (page - 1) * limit
        
        # Get filters
        category = request.args.get('category', '')
        level = request.args.get('level', '')
        search = request.args.get('search', '')
        
        # Build query
        query = {}
        if category:
            query['category'] = category
        if level:
            query['level'] = level
        if search:
            query['$text'] = {'$search': search}
        
        # Get total count
        total = mongo.db.courses.count_documents(query)
        
        # Get courses with pagination
        courses = mongo.db.courses.find(query).skip(skip).limit(limit)
        
        course_list = []
        for course in courses:
            # Add dummy metadata for demo purposes
            dummy_data = get_dummy_metadata(course.get('_id'))
            
            course_data = {
                "id": str(course.get('_id', '')),
                "title": course.get('title', ''),
                "category": course.get('category', ''),
                "level": course.get('level', ''),
                "description": course.get('description', ''),
                "instructorName": course.get('instructorName', ''),
                "image": course.get('image', ''),
                "rating": dummy_data['rating'],
                "ratingCount": dummy_data['ratingCount'],
                "duration": dummy_data['duration'],
                "url": f"/course/{str(course.get('_id', ''))}"
            }
            course_list.append(course_data)
        
        return jsonify({
            'courses': course_list,
            'page': page,
            'limit': limit,
            'totalCourses': total,
            'totalPages': math.ceil(total / limit)
        })
        
    except Exception as e:
        print(f"Error in courses API: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route("/api/recommendations", methods=["GET"])
def get_recommendations():
    try:
        # Get user preferences from query parameters
        user_interests = request.args.get('interests', '')
        user_level = request.args.get('level', '')
        preferred_category = request.args.get('category', '')
        sort_by = request.args.get('sort', 'relevance')
        
        # Get pagination parameters
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 8))
        
        # If courses_df is empty, return empty result
        if courses_df.empty:
            return jsonify({
                'courses': [],
                'page': page,
                'limit': limit,
                'totalCourses': 0,
                'totalPages': 0
            })
        
        # If no interests provided, return popular or new courses
        if not user_interests:
            # Filter courses by level and category if specified
            filtered_df = courses_df.copy()
            
            if user_level:
                filtered_df = filtered_df[filtered_df['level'] == user_level]
            
            if preferred_category:
                filtered_df = filtered_df[filtered_df['category'] == preferred_category]
            
            # Sort based on preference
            if sort_by == 'newest' and 'date' in filtered_df.columns:
                filtered_df = filtered_df.sort_values('date', ascending=False)
            elif sort_by == 'rating' and 'rating' in filtered_df.columns:
                filtered_df = filtered_df.sort_values('rating', ascending=False)
            elif sort_by == 'popularity' and 'enrollments' in filtered_df.columns:
                filtered_df = filtered_df.sort_values('enrollments', ascending=False)
            
            # Default to random order if sort criteria not available
            if filtered_df.empty:
                return jsonify({
                    'courses': [],
                    'page': page,
                    'limit': limit,
                    'totalCourses': 0,
                    'totalPages': 0
                })
            
            # Apply pagination
            total = len(filtered_df)
            start_idx = (page - 1) * limit
            end_idx = min(start_idx + limit, len(filtered_df))
            
            paginated_df = filtered_df.iloc[start_idx:end_idx]
            
        else:
            # Process user interests similar to how course data is processed
            processed_interests = preprocess_text(user_interests)
            
            # Transform interests into TF-IDF vector
            interest_vector = vectorizer.transform([processed_interests])
            
            # Calculate similarity with all courses
            similarities = cosine_similarity(interest_vector, course_vectors).flatten()
            
            # Create a temporary dataframe with similarities
            temp_df = courses_df.copy()
            temp_df['similarity'] = similarities
            
            # Apply filters
            if user_level:
                temp_df = temp_df[temp_df['level'] == user_level]
            
            if preferred_category:
                temp_df = temp_df[temp_df['category'] == preferred_category]
            
            # Sort by similarity by default
            filtered_df = temp_df.sort_values('similarity', ascending=False)
            
            # Apply pagination
            total = len(filtered_df)
            start_idx = (page - 1) * limit
            end_idx = min(start_idx + limit, len(filtered_df))
            
            paginated_df = filtered_df.iloc[start_idx:end_idx]
        
        # Convert paginated courses to response format
        course_list = []
        for _, course in paginated_df.iterrows():
            # Add dummy metadata for demo purposes
            dummy_data = get_dummy_metadata(course.get('_id'))
            
            course_data = {
                "id": str(course.get('_id', '')),
                "title": course.get('title', ''),
                "category": course.get('category', ''),
                "level": course.get('level', ''),
                "description": course.get('description', ''),
                "instructorName": course.get('instructorName', ''),
                "image": course.get('image', ''),
                "rating": dummy_data['rating'],
                "ratingCount": dummy_data['ratingCount'],
                "duration": dummy_data['duration'],
                "url": f"/course/{str(course.get('_id', ''))}"
            }
            
            # Add similarity score if available
            if 'similarity' in course:
                course_data['similarity'] = float(course['similarity'])
                
            course_list.append(course_data)
        
        return jsonify({
            'courses': course_list,
            'page': page,
            'limit': limit,
            'totalCourses': total,
            'totalPages': math.ceil(total / limit)
        })
        
    except Exception as e:
        print(f"Error in recommendations API: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route("/api/course/<course_id>", methods=["GET"])
def get_course_details(course_id):
    try:
        # Find course by ID
        course = mongo.db.courses.find_one({"_id": ObjectId(course_id)})
        
        if not course:
            return jsonify({"error": "Course not found"}), 404
        
        # Add dummy metadata for demo
        dummy_data = get_dummy_metadata(course.get('_id'))
        
        # Convert ObjectId to string
        course['_id'] = str(course['_id'])
        
        # Add dummy data
        course['rating'] = dummy_data['rating']
        course['ratingCount'] = dummy_data['ratingCount']
        course['duration'] = dummy_data['duration']
        course['enrollmentCount'] = np.random.randint(100, 10000)
        
        # Structure response
        course_data = {
            "id": course['_id'],
            "title": course.get('title', ''),
            "subtitle": course.get('subtitle', ''),
            "description": course.get('description', ''),
            "category": course.get('category', ''),
            "level": course.get('level', ''),
            "instructorName": course.get('instructorName', ''),
            "instructorBio": course.get('instructorBio', ''),
            "image": course.get('image', ''),
            "rating": course.get('rating'),
            "ratingCount": course.get('ratingCount'),
            "duration": course.get('duration'),
            "enrollmentCount": course.get('enrollmentCount'),
            "objectives": course.get('objectives', ''),
            "welcomeMessage": course.get('welcomeMessage', ''),
            "requirements": course.get('requirements', []),
            "syllabus": course.get('syllabus', [])
        }
        
        return jsonify(course_data)
    
    except Exception as e:
        print(f"Error in course details API: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route("/api/categories", methods=["GET"])
def get_categories():
    try:
        # Get distinct categories from the courses collection
        categories = mongo.db.courses.distinct("category")
        
        # Return the list of categories
        return jsonify({
            "categories": categories
        })
    
    except Exception as e:
        print(f"Error in categories API: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route("/api/levels", methods=["GET"])
def get_levels():
    try:
        # Get distinct levels from the courses collection
        levels = mongo.db.courses.distinct("level")
        
        # Return the list of levels
        return jsonify({
            "levels": levels
        })
    
    except Exception as e:
        print(f"Error in levels API: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route("/api/search", methods=["GET"])
def search_courses():
    try:
        # Get search query
        search_query = request.args.get('q', '')
        
        # Get pagination parameters
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 10))
        
        # Get filters
        category = request.args.get('category', '')
        level = request.args.get('level', '')
        
        if not search_query:
            return jsonify({
                'courses': [],
                'page': page,
                'limit': limit,
                'totalCourses': 0,
                'totalPages': 0,
                'query': search_query
            })
        
        # Build search query
        query = {"$text": {"$search": search_query}}
        
        # Add filters
        if category:
            query['category'] = category
        if level:
            query['level'] = level
        
        # Calculate skip for pagination
        skip = (page - 1) * limit
        
        # Get total count
        total = mongo.db.courses.count_documents(query)
        
        # Get search results with pagination
        results = mongo.db.courses.find(
            query,
            {"score": {"$meta": "textScore"}}  # Include text search score
        ).sort([("score", {"$meta": "textScore"})]).skip(skip).limit(limit)
        
        course_list = []
        for course in results:
            # Add dummy metadata for demo purposes
            dummy_data = get_dummy_metadata(course.get('_id'))
            
            course_data = {
                "id": str(course.get('_id', '')),
                "title": course.get('title', ''),
                "category": course.get('category', ''),
                "level": course.get('level', ''),
                "description": course.get('description', ''),
                "instructorName": course.get('instructorName', ''),
                "image": course.get('image', ''),
                "rating": dummy_data['rating'],
                "ratingCount": dummy_data['ratingCount'],
                "duration": dummy_data['duration'],
                "url": f"/course/{str(course.get('_id', ''))}",
                "searchScore": course.get('score', 0)
            }
            course_list.append(course_data)
        
        return jsonify({
            'courses': course_list,
            'page': page,
            'limit': limit,
            'totalCourses': total,
            'totalPages': math.ceil(total / limit),
            'query': search_query
        })
        
    except Exception as e:
        print(f"Error in search API: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route("/api/user/progress", methods=["GET", "POST"])
def user_progress():
    """API for user course progress tracking"""
    
    # Get user_id from request headers or parameters
    user_id = request.headers.get('User-ID') or request.args.get('user_id')
    
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400
    
    if request.method == "GET":
        try:
            # Get course_id if provided
            course_id = request.args.get('course_id')
            
            if course_id:
                # Retrieve progress for specific course
                progress = mongo.db.user_progress.find_one({
                    "user_id": user_id,
                    "course_id": course_id
                })
                
                if not progress:
                    return jsonify({"progress": 0, "status": "not_started"}), 200
                
                # Convert ObjectId to string
                progress['_id'] = str(progress['_id'])
                
                return jsonify(progress), 200
            else:
                # Retrieve all progress for user
                progress_list = list(mongo.db.user_progress.find({"user_id": user_id}))
                
                # Convert ObjectId to string in each document
                for item in progress_list:
                    item['_id'] = str(item['_id'])
                
                return jsonify({"progress": progress_list}), 200
                
        except Exception as e:
            print(f"Error retrieving user progress: {str(e)}")
            return jsonify({"error": str(e)}), 500
    
    elif request.method == "POST":
        try:
            # Get data from request body
            data = request.json
            
            if not data or 'course_id' not in data:
                return jsonify({"error": "Course ID is required"}), 400
            
            # Required fields
            required_fields = ['course_id', 'progress_percentage', 'status']
            if not all(field in data for field in required_fields):
                return jsonify({"error": f"Missing required fields: {', '.join(required_fields)}"}), 400
            
            # Prepare document
            progress_doc = {
                "user_id": user_id,
                "course_id": data['course_id'],
                "progress_percentage": data['progress_percentage'],
                "status": data['status'],  # e.g., 'not_started', 'in_progress', 'completed'
                "last_activity": datetime.datetime.now(),
                "completed_modules": data.get('completed_modules', []),
                "time_spent": data.get('time_spent', 0)  # in seconds
            }
            
            # Update or insert progress document
            result = mongo.db.user_progress.update_one(
                {"user_id": user_id, "course_id": data['course_id']},
                {"$set": progress_doc},
                upsert=True
            )
            
            return jsonify({
                "success": True,
                "updated": result.modified_count > 0,
                "inserted": result.upserted_id is not None
            }), 200
            
        except Exception as e:
            print(f"Error updating user progress: {str(e)}")
            return jsonify({"error": str(e)}), 500

@app.route("/api/user/bookmarks", methods=["GET", "POST", "DELETE"])
def user_bookmarks():
    """API for user bookmarks"""
    
    # Get user_id from request headers or parameters
    user_id = request.headers.get('User-ID') or request.args.get('user_id')
    
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400
    
    if request.method == "GET":
        try:
            # Retrieve all bookmarks for user
            bookmarks = list(mongo.db.bookmarks.find({"user_id": user_id}))
            
            # Convert ObjectId to string
            for bookmark in bookmarks:
                bookmark['_id'] = str(bookmark['_id'])
                
            # Fetch course details for each bookmark
            course_list = []
            for bookmark in bookmarks:
                course_id = bookmark.get('course_id')
                if course_id:
                    course = mongo.db.courses.find_one({"_id": ObjectId(course_id)})
                    if course:
                        # Add dummy metadata
                        dummy_data = get_dummy_metadata(course.get('_id'))
                        
                        course_data = {
                            "id": str(course.get('_id', '')),
                            "title": course.get('title', ''),
                            "category": course.get('category', ''),
                            "image": course.get('image', ''),
                            "bookmark_id": bookmark.get('_id'),
                            "bookmarked_at": bookmark.get('created_at', ''),
                            "rating": dummy_data['rating'],
                            "duration": dummy_data['duration']
                        }
                        
                        course_list.append(course_data)
            
            return jsonify({"bookmarks": course_list}), 200
                
        except Exception as e:
            print(f"Error retrieving bookmarks: {str(e)}")
            return jsonify({"error": str(e)}), 500
    
    elif request.method == "POST":
        try:
            # Get data from request body
            data = request.json
            
            if not data or 'course_id' not in data:
                return jsonify({"error": "Course ID is required"}), 400
            
            course_id = data['course_id']
            
            # Check if bookmark already exists
            existing = mongo.db.bookmarks.find_one({
                "user_id": user_id,
                "course_id": course_id
            })
            
            if existing:
                return jsonify({
                    "success": False,
                    "message": "Course already bookmarked",
                    "bookmark_id": str(existing['_id'])
                }), 200
            
            # Create new bookmark
            bookmark = {
                "user_id": user_id,
                "course_id": course_id,
                "created_at": datetime.datetime.now()
            }
            
            result = mongo.db.bookmarks.insert_one(bookmark)
            
            return jsonify({
                "success": True,
                "bookmark_id": str(result.inserted_id)
            }), 201
            
        except Exception as e:
            print(f"Error creating bookmark: {str(e)}")
            return jsonify({"error": str(e)}), 500
    
    elif request.method == "DELETE":
        try:
            course_id = request.args.get('course_id')
            bookmark_id = request.args.get('bookmark_id')
            
            if not (course_id or bookmark_id):
                return jsonify({"error": "Course ID or bookmark ID is required"}), 400
            
            if bookmark_id:
                # Delete by bookmark ID
                result = mongo.db.bookmarks.delete_one({
                    "_id": ObjectId(bookmark_id),
                    "user_id": user_id
                })
            else:
                # Delete by course ID
                result = mongo.db.bookmarks.delete_one({
                    "course_id": course_id,
                    "user_id": user_id
                })
            
            if result.deleted_count > 0:
                return jsonify({
                    "success": True,
                    "message": "Bookmark deleted successfully"
                }), 200
            else:
                return jsonify({
                    "success": False,
                    "message": "Bookmark not found"
                }), 404
                
        except Exception as e:
            print(f"Error deleting bookmark: {str(e)}")
            return jsonify({"error": str(e)}), 500

# Run the application
if __name__ == "__main__":
    # Create text index for search functionality
    try:
        mongo.db.courses.create_index([
            ("title", "text"),
            ("description", "text"),
            ("subtitle", "text"),
            ("objectives", "text"),
            ("welcomeMessage", "text")
        ])
        print("Text index created successfully")
    except Exception as e:
        print(f"Error creating text index: {str(e)}")
    
    # Rebuild recommendation model
    vectorizer, courses_df, course_vectors = build_recommendation_model()
    
    # Run app in debug mode
    app.run(debug=True, host='0.0.0.0', port=5001)