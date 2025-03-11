document.addEventListener('DOMContentLoaded', () => {
    // Course data array
    const courses = [
      {
        code: "CSE 110",
        name: "Introduction to Programming",
        credits: 3,
        completed: false,
        category: "CSE"
      },
      {
        code: "CSE 111",
        name: "Programming with Functions",
        credits: 3,
        completed: true,
        category: "CSE"
      },
      {
        code: "CSE 210",
        name: "Programming with Classes",
        credits: 3,
        completed: true,
        category: "CSE"
      },
      {
        code: "WDD 130",
        name: "Web Fundamentals",
        credits: 3,
        completed: true,
        category: "WDD"
      },
      {
        code: "WDD 131",
        name: "Web Frontend Development I",
        credits: 3,
        completed: false,
        category: "WDD"
      },
      {
        code: "WDD 231",
        name: "Web Frontend Development II",
        credits: 3,
        completed: false,
        category: "WDD"
      }
    ];
    
    // DOM Elements
    const coursesContainer = document.getElementById('courses-container');
    const totalCreditsElement = document.getElementById('total-credits');
    const allCoursesButton = document.getElementById('all-courses');
    const cseCoursesButton = document.getElementById('cse-courses');
    const wddCoursesButton = document.getElementById('wdd-courses');
    
    // Filter buttons functionality
    function setActiveButton(activeButton) {
      [allCoursesButton, cseCoursesButton, wddCoursesButton].forEach(button => {
        button.classList.remove('active');
      });
      activeButton.classList.add('active');
    }
    
    // Display courses based on filter
    function displayCourses(coursesToDisplay) {
      coursesContainer.innerHTML = '';
      
      coursesToDisplay.forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.className = `course-card ${course.completed ? 'completed' : 'incomplete'}`;
        courseCard.innerHTML = `<h3>${course.code}</h3>`;
        coursesContainer.appendChild(courseCard);
      });
      
      // Calculate total credits using reduce method
      const totalCredits = coursesToDisplay.reduce((sum, course) => sum + course.credits, 0);
      totalCreditsElement.textContent = totalCredits;
    }
    
    // Event listeners for filter buttons
    allCoursesButton.addEventListener('click', () => {
      setActiveButton(allCoursesButton);
      displayCourses(courses);
    });
    
    cseCoursesButton.addEventListener('click', () => {
      setActiveButton(cseCoursesButton);
      const cseOnly = courses.filter(course => course.category === 'CSE');
      displayCourses(cseOnly);
    });
    
    wddCoursesButton.addEventListener('click', () => {
      setActiveButton(wddCoursesButton);
      const wddOnly = courses.filter(course => course.category === 'WDD');
      displayCourses(wddOnly);
    });
    
    // Initial display - show all courses
    displayCourses(courses);
  });