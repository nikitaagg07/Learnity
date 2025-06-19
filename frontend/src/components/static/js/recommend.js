document.addEventListener('DOMContentLoaded', function() {
    const app = document.getElementById('app');

    app.innerHTML = `
        <div class="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">
            <div class="bg-gradient-to-r from-blue-600 to-purple-600 py-8 px-6 text-center text-white">
                <h2 class="text-4xl font-bold tracking-wide">🔥 Course Recommendation System</h2>
                <p class="text-md mt-2 font-light">Built with ❤️ by <strong>KNOWLEDGE DOCTOR</strong></p>
            </div>

            <div class="p-8">
                <form id="recommendForm" class="mb-10">
                    <label for="course_name" class="block text-gray-700 text-lg font-semibold mb-3">
                        🚀 Type a course you like:
                    </label>
                    <input list="course_list" name="course_name" id="course_name"
                        placeholder="e.g., MongoDB, Python"
                        class="shadow-lg border border-gray-300 rounded-xl w-full py-3 px-4 text-gray-700 text-md focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-200" />

                    <datalist id="course_list">
                        <!-- JS will fetch and populate options -->
                    </datalist>

                    <button type="submit"
                        class="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 px-6 mt-6 rounded-xl shadow-md transition-transform transform hover:scale-105 duration-200">
                        🎯 Show Recommended Courses
                    </button>
                </form>

                <div id="recommendations" class="mt-8"></div>
            </div>
        </div>
    `;

    // After injecting, setup events
    loadCourses();
    setupFormListener();
});

function loadCourses() {
    fetch('/api/courses')
        .then(response => response.json())
        .then(data => {
            const courseList = document.getElementById('course_list');
            data.forEach(course => {
                const option = document.createElement('option');
                option.value = course;
                courseList.appendChild(option);
            });
        })
        .catch(error => console.error('Error loading courses:', error));
}

function setupFormListener() {
    const form = document.getElementById('recommendForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const selectedCourse = document.getElementById('course_name').value;
        getRecommendations(selectedCourse);
    });
}

function getRecommendations(courseName) {
    fetch('/api/recommend', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ course_name: courseName }),
    })
    .then(response => response.json())
    .then(data => {
        const recommendationsDiv = document.getElementById('recommendations');
        recommendationsDiv.innerHTML = `<h3 class="text-2xl font-semibold text-gray-800 mb-4">🎓 Recommended Courses:</h3>`;
        
        if (data.length === 0) {
            recommendationsDiv.innerHTML += `<p class="text-red-500 font-semibold">No recommendations found for this course.</p>`;
            return;
        }

        const grid = document.createElement('div');
        grid.className = "grid grid-cols-1 md:grid-cols-2 gap-4";

        data.forEach(course => {
            const card = `
                <div class="bg-white border border-gray-200 p-5 rounded-lg shadow hover:shadow-lg transition duration-200">
                    <h4 class="text-lg font-bold text-blue-600 mb-2">${course.name}</h4>
                    <p class="text-sm text-gray-500">${course.category} | ${course.level}</p>
                    <a href="${course.url}" class="text-blue-500 underline">View Details</a>
                </div>
            `;
            grid.innerHTML += card;
        });

        recommendationsDiv.appendChild(grid);
    })
    .catch(error => console.error('Error fetching recommendations:', error));
}
