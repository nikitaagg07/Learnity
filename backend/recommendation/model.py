import pandas as pd
import nltk
import pickle
import os
from sklearn.feature_extraction.text import TfidfVectorizer
from nltk.stem.porter import PorterStemmer

# Download necessary NLTK packages
nltk.download('punkt')

ps = PorterStemmer()

def preprocess_text(text):
    tokens = nltk.word_tokenize(text.lower())
    stemmed_tokens = [ps.stem(word) for word in tokens if word.isalnum()]
    return ' '.join(stemmed_tokens)

def combine_course_text(course):
    """Combine fields like title, subtitle, description, objectives, welcomeMessage into one string"""
    combined = f"{course['title']} {course['subtitle']} {course['description']} {course['objectives']} {course['welcomeMessage']}"
    return combined

def train_and_export_model(courses_json):
    # If you are connecting to MongoDB, fetch it here. 
    # For now assuming courses_json is list of dictionaries.

    courses_df = pd.DataFrame(courses_json)

    # Create a new column that combines important text fields
    courses_df['combined_text'] = courses_df.apply(combine_course_text, axis=1)

    # Preprocess the combined text
    courses_df['processed_text'] = courses_df['combined_text'].apply(preprocess_text)

    # Vectorize the text
    vectorizer = TfidfVectorizer()
    vectors = vectorizer.fit_transform(courses_df['processed_text'])

    # Save the vectorizer and courses
    if not os.path.exists('backend/recommendation'):
        os.makedirs('backend/recommendation')

    pickle.dump(vectorizer, open('backend/vectorizer.pkl', 'wb'))
    pickle.dump(courses_df, open('backend/courses.pkl', 'wb'))

    print("✅ Training complete. Models exported.")

