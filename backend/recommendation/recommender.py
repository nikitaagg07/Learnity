import pickle
from sklearn.metrics.pairwise import cosine_similarity

vectorizer = pickle.load(open('backend/vectorizer.pkl', 'rb'))
courses = pickle.load(open('backend/courses.pkl', 'rb'))

def recommend_course(user_input):
    from recommendation.model import preprocess_text

    processed_input = preprocess_text(user_input)
    input_vector = vectorizer.transform([processed_input])

    similarities = cosine_similarity(input_vector, vectorizer.transform(courses['processed_text'])).flatten()

    top_indices = similarities.argsort()[-5:][::-1]

    recommended_courses = courses.iloc[top_indices]

    # Properly format recommendations
    recommendations = []
    for _, row in recommended_courses.iterrows():
        recommendations.append({
            "name": row['title'],
            "subtitle": row.get('subtitle', ''),
            "description": row.get('description', ''),
            "image": row.get('image', ''),
            "instructorName": row.get('instructorName', ''),
            "pricing": row.get('pricing', ''),
            "level": row.get('level', ''),
        })

    return recommendations
