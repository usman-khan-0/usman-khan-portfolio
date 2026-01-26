document.addEventListener('DOMContentLoaded', () => {
    // Grading scales
    const gradingScales = {
        standard: {
            'A+': 4.3, 'A': 4.0, 'A-': 3.7,
            'B+': 3.3, 'B': 3.0, 'B-': 2.7,
            'C+': 2.3, 'C': 2.0, 'C-': 1.7,
            'D+': 1.3, 'D': 1.0, 'D-': 0.7,
            'F': 0.0,
        },
        weighted: {
            'A+': 5.3, 'A': 5.0, 'A-': 4.7,
            'B+': 4.3, 'B': 4.0, 'B-': 3.7,
            'C+': 3.3, 'C': 3.0, 'C-': 2.7,
            'D+': 2.3, 'D': 2.0, 'D-': 1.7,
            'F': 0.0,
        },
        custom: {
            'A+': 4.3, 'A': 4.0, 'A-': 3.7,
            'B+': 3.3, 'B': 3.0, 'B-': 2.7,
            'C+': 2.3, 'C': 2.0, 'C-': 1.7,
            'D+': 1.3, 'D': 1.0, 'D-': 0.7,
            'F': 0.0,
        }
    };

    let currentScale = 'standard';
    let courseCount = 0;
    let courses = [];

    // DOM Elements
    const courseList = document.getElementById('course-list');
    const addCourseBtn = document.getElementById('add-course');
    const calculateGpaBtn = document.getElementById('calculate-gpa');
    const clearAllBtn = document.getElementById('clear-all');
    const resultsSection = document.getElementById('results');
    const downloadPdfBtn = document.getElementById('download-pdf');
    const gradingScaleSelect = document.getElementById('grading-scale');
    const liveGpaEl = document.getElementById('live-gpa');
    const gpaResultEl = document.getElementById('gpa-result');
    const totalCreditsEl = document.getElementById('total-credits');
    const qualityPointsEl = document.getElementById('quality-points');
    const courseCountEl = document.getElementById('course-count');
    const breakdownList = document.getElementById('breakdown-list');
    const gradingScaleTable = document.getElementById('grading-scale-table');
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.querySelector('.nav-links');

    // Initialize
    function init() {
        populateGradingScale();
        addCourse();
        setupEventListeners();
        updateLiveGPA();
    }

    function populateGradingScale() {
        const scale = gradingScales[currentScale];
        let tableHtml = '<thead><tr><th>Grade</th><th>Points</th><th>Description</th></tr></thead><tbody>';
        
        for (const [grade, points] of Object.entries(scale)) {
            let description = '';
            if (grade === 'A+') description = 'Excellent';
            else if (grade === 'A') description = 'Outstanding';
            else if (grade === 'A-') description = 'Very Good';
            else if (grade === 'B+') description = 'Good';
            else if (grade === 'B') description = 'Above Average';
            else if (grade === 'B-') description = 'Average';
            else if (grade === 'C+') description = 'Below Average';
            else if (grade === 'C') description = 'Satisfactory';
            else if (grade === 'D+') description = 'Poor';
            else if (grade === 'D') description = 'Very Poor';
            else if (grade === 'F') description = 'Fail';
            
            tableHtml += `
                <tr>
                    <td><span class="grade-badge">${grade}</span></td>
                    <td><strong>${points.toFixed(1)}</strong></td>
                    <td>${description}</td>
                </tr>
            `;
        }
        
        tableHtml += '</tbody>';
        gradingScaleTable.innerHTML = tableHtml;
    }

    function addCourse(name = '', grade = 'A', credits = '3') {
        courseCount++;
        const courseId = `course-${courseCount}`;
        
        const courseRow = document.createElement('div');
        courseRow.className = 'course-row';
        courseRow.id = courseId;
        
        courseRow.innerHTML = `
            <div class="input-cell">
                <input type="text" 
                       placeholder="Course Name (e.g., Calculus)" 
                       class="course-name" 
                       value="${name}"
                       oninput="updateLiveGPA()">
            </div>
            <div class="input-cell">
                <select class="grade" onchange="updateLiveGPA()">
                    ${Object.keys(gradingScales[currentScale]).map(g => 
                        `<option value="${g}" ${g === grade ? 'selected' : ''}>${g}</option>`
                    ).join('')}
                </select>
            </div>
            <div class="input-cell">
                <input type="number" 
                       placeholder="Credits" 
                       class="credits" 
                       min="0" 
                       step="0.5" 
                       value="${credits}"
                       oninput="updateLiveGPA()">
            </div>
            <div class="input-cell">
                <button class="remove-course" onclick="removeCourse('${courseId}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        courseList.appendChild(courseRow);
        updateCalculateBtnState();
        saveCoursesToStorage();
    }

    window.removeCourse = function(id) {
        const courseRow = document.getElementById(id);
        if (courseRow) {
            courseRow.remove();
            courseCount--;
            updateCalculateBtnState();
            updateLiveGPA();
            saveCoursesToStorage();
        }
    }

    function clearAllCourses() {
        courseList.innerHTML = '';
        courseCount = 0;
        courses = [];
        updateCalculateBtnState();
        updateLiveGPA();
        resultsSection.style.display = 'none';
        localStorage.removeItem('gpaCourses');
    }

    function updateCalculateBtnState() {
        const courses = document.querySelectorAll('.course-row');
        calculateGpaBtn.disabled = courses.length === 0;
    }

    window.updateLiveGPA = function() {
        const result = calculateGPA();
        if (result.totalCredits > 0) {
            liveGpaEl.textContent = result.gpa.toFixed(2);
        } else {
            liveGpaEl.textContent = '0.00';
        }
    }

    function calculateGPA() {
        const courses = document.querySelectorAll('.course-row');
        const scale = gradingScales[currentScale];
        let totalPoints = 0;
        let totalCredits = 0;
        let qualityPoints = 0;
        const courseDetails = [];

        courses.forEach((course, index) => {
            const name = course.querySelector('.course-name').value || `Course ${index + 1}`;
            const grade = course.querySelector('.grade').value;
            const credits = parseFloat(course.querySelector('.credits').value) || 0;

            if (credits > 0 && scale[grade] !== undefined) {
                const points = scale[grade] * credits;
                totalPoints += points;
                totalCredits += credits;
                qualityPoints += scale[grade] * credits;

                courseDetails.push({
                    name,
                    grade,
                    credits,
                    points: scale[grade],
                    qualityPoints: points
                });
            }
        });

        const gpa = totalCredits > 0 ? (totalPoints / totalCredits) : 0;

        return {
            gpa,
            totalCredits,
            qualityPoints,
            courseCount: courses.length,
            courseDetails
        };
    }

    function displayResults() {
        const result = calculateGPA();
        
        gpaResultEl.textContent = result.gpa.toFixed(2);
        totalCreditsEl.textContent = result.totalCredits;
        qualityPointsEl.textContent = result.qualityPoints.toFixed(1);
        courseCountEl.textContent = result.courseDetails.length;
        
        // Update breakdown list
        breakdownList.innerHTML = '';
        result.courseDetails.forEach((course, index) => {
            const breakdownItem = document.createElement('div');
            breakdownItem.className = 'breakdown-item';
            breakdownItem.innerHTML = `
                <div class="breakdown-header">
                    <span class="breakdown-index">${index + 1}</span>
                    <span class="breakdown-name">${course.name}</span>
                    <span class="breakdown-grade">${course.grade} (${course.points.toFixed(1)})</span>
                </div>
                <div class="breakdown-details">
                    <span>Credits: ${course.credits}</span>
                    <span>Points: ${course.qualityPoints.toFixed(1)}</span>
                </div>
            `;
            breakdownList.appendChild(breakdownItem);
        });
        
        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }

    async function generatePDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const result = calculateGPA();
        
        // Add header
        doc.setFillColor(67, 97, 238);
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.text('GPA Calculator Report', 105, 20, { align: 'center' });
        
        // Add date
        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 30, { align: 'center' });
        
        // Add summary section
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(18);
        doc.text('GPA Summary', 20, 55);
        
        doc.setFontSize(12);
        doc.text(`Overall GPA: ${result.gpa.toFixed(2)}`, 20, 65);
        doc.text(`Total Credits: ${result.totalCredits}`, 20, 72);
        doc.text(`Quality Points: ${result.qualityPoints.toFixed(1)}`, 20, 79);
        doc.text(`Number of Courses: ${result.courseDetails.length}`, 20, 86);
        
        // Add course breakdown
        doc.setFontSize(18);
        doc.text('Course Breakdown', 20, 100);
        
        let yPos = 110;
        doc.setFontSize(10);
        
        // Table headers
        doc.setFillColor(240, 240, 240);
        doc.rect(20, yPos - 5, 170, 8, 'F');
        doc.text('Course Name', 25, yPos);
        doc.text('Grade', 100, yPos);
        doc.text('Credits', 130, yPos);
        doc.text('Points', 160, yPos);
        doc.text('Total', 180, yPos);
        
        yPos += 10;
        
        // Course rows
        result.courseDetails.forEach((course, index) => {
            if (yPos > 280) {
                doc.addPage();
                yPos = 20;
            }
            
            doc.text(course.name, 25, yPos);
            doc.text(course.grade, 100, yPos);
            doc.text(course.credits.toString(), 130, yPos);
            doc.text(course.points.toFixed(1), 160, yPos);
            doc.text(course.qualityPoints.toFixed(1), 180, yPos);
            
            yPos += 7;
        });
        
        // Add footer
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text('Generated by GPA Calculator - UsmanKhan.dev', 105, 290, { align: 'center' });
        
        // Save the PDF
        doc.save(`GPA-Report-${new Date().toISOString().split('T')[0]}.pdf`);
    }

    function saveCoursesToStorage() {
        const courses = [];
        document.querySelectorAll('.course-row').forEach(row => {
            const name = row.querySelector('.course-name').value;
            const grade = row.querySelector('.grade').value;
            const credits = row.querySelector('.credits').value;
            courses.push({ name, grade, credits });
        });
        localStorage.setItem('gpaCourses', JSON.stringify(courses));
        localStorage.setItem('gpaScale', currentScale);
    }

    function loadCoursesFromStorage() {
        const savedCourses = localStorage.getItem('gpaCourses');
        const savedScale = localStorage.getItem('gpaScale');
        
        if (savedScale) {
            currentScale = savedScale;
            gradingScaleSelect.value = savedScale;
            populateGradingScale();
        }
        
        if (savedCourses) {
            const courses = JSON.parse(savedCourses);
            courses.forEach(course => {
                addCourse(course.name, course.grade, course.credits);
            });
        }
    }

    function setupEventListeners() {
        addCourseBtn.addEventListener('click', () => addCourse());
        calculateGpaBtn.addEventListener('click', displayResults);
        clearAllBtn.addEventListener('click', clearAllCourses);
        downloadPdfBtn.addEventListener('click', generatePDF);
        
        gradingScaleSelect.addEventListener('change', (e) => {
            currentScale = e.target.value;
            populateGradingScale();
            updateLiveGPA();
            saveCoursesToStorage();
        });
        
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
                navLinks.classList.remove('active');
            }
        });
        
        // Auto-save on input
        document.addEventListener('input', () => {
            saveCoursesToStorage();
        });
    }

    // Make functions available globally
    window.addCourse = addCourse;
    window.removeCourse = removeCourse;
    window.updateLiveGPA = updateLiveGPA;

    // Initialize the app
    loadCoursesFromStorage();
    init();
});
