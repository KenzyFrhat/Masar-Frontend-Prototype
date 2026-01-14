document.addEventListener('DOMContentLoaded', function() {
    // بيانات المراحل والكورسات
    const learningData = {
        stages: [
            {
                id: 'stage-1',
                number: 1,
                title: 'أساسيات البرمجة',
                description: 'بناء الأساس القوي في البرمجة',
                progress: 75,
                courses: [
                    {
                        id: 'html-css',
                        title: 'HTML & CSS للمبتدئين',
                        description: 'تعلم بناء وتصميم صفحات الويب',
                        icon: 'fab fa-html5',
                        progress: 100,
                        lessons: [
                            {
                                id: 'html-basics',
                                title: 'مقدمة إلى HTML',
                                description: 'تعلم أساسيات HTML في 30 دقيقة',
                                duration: '30:15',
                                youtubeId: 'qz0aGYrrlhU',
                                completed: true
                            },
                            {
                                id: 'css-fundamentals',
                                title: 'أساسيات CSS',
                                description: 'تصميم صفحات الويب باستخدام CSS',
                                duration: '45:30',
                                youtubeId: '1PnVor36_40',
                                completed: true
                            },
                            {
                                id: 'responsive-design',
                                title: 'التصميم المتجاوب',
                                description: 'جعل المواقع تعمل على جميع الأجهزة',
                                duration: '42:30',
                                youtubeId: 'srvUrASNj0s',
                                completed: true
                            }
                        ]
                    },
                    {
                        id: 'javascript-basics',
                        title: 'JavaScript الأساسي',
                        description: 'ابدأ رحلتك في برمجة JavaScript',
                        icon: 'fab fa-js-square',
                        progress: 50,
                        lessons: [
                            {
                                id: 'js-intro',
                                title: 'مقدمة JavaScript',
                                description: 'تعلم البرمجة بلغة JavaScript',
                                duration: '1:05:20',
                                youtubeId: 'W6NZfCO5SIk',
                                completed: true
                            },
                            {
                                id: 'js-functions',
                                title: 'الدوال في JavaScript',
                                description: 'كيفية كتابة واستخدام الدوال',
                                duration: '40:00',
                                youtubeId: 'Mus_vwhTCq0',
                                completed: false
                            },
                            {
                                id: 'js-arrays',
                                title: 'المصفوفات في JavaScript',
                                description: 'كيفية التعامل مع المصفوفات',
                                duration: '35:45',
                                youtubeId: '7W4pQQ20nJg',
                                completed: false
                            }
                        ]
                    },
                    {
                        id: 'git-github',
                        title: 'Git & GitHub',
                        description: 'تعلم التحكم في الإصدارات والتعاون',
                        icon: 'fab fa-git-alt',
                        progress: 0,
                        lessons: [
                            {
                                id: 'git-basics',
                                title: 'مقدمة إلى Git',
                                description: 'أساسيات نظام التحكم في الإصدارات',
                                duration: '1:20:00',
                                youtubeId: 'RGOj5yH7evk',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 'stage-2',
                number: 2,
                title: 'تطوير الويب المتقدم',
                description: 'بناء تطبيقات ويب متقدمة',
                progress: 20,
                courses: [
                    {
                        id: 'react-basics',
                        title: 'React.js للمبتدئين',
                        description: 'تعلم بناء واجهات مستخدم تفاعلية',
                        icon: 'fab fa-react',
                        progress: 20,
                        lessons: [
                            {
                                id: 'react-intro',
                                title: 'مقدمة إلى React',
                                description: 'تعلم أساسيات مكتبة React',
                                duration: '55:00',
                                youtubeId: 'w7ejDZ8SWv8',
                                completed: false
                            }
                        ]
                    },
                    {
                        id: 'nodejs-basics',
                        title: 'Node.js الأساسي',
                        description: 'بناء تطبيقات خادم باستخدام JavaScript',
                        icon: 'fab fa-node-js',
                        progress: 0,
                        lessons: [
                            {
                                id: 'nodejs-intro',
                                title: 'مقدمة إلى Node.js',
                                description: 'تعلم برمجة الخادم باستخدام JavaScript',
                                duration: '50:30',
                                youtubeId: 'TlB_eWDSMt4',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 'stage-3',
                number: 3,
                title: 'مشاريع عملية',
                description: 'بناء مشاريع حقيقية وتطبيق المعرفة',
                progress: 0,
                courses: [
                    {
                        id: 'portfolio-project',
                        title: 'مشروع Portfolio',
                        description: 'بناء موقع شخصي احترافي',
                        icon: 'fas fa-briefcase',
                        progress: 0,
                        lessons: [
                            {
                                id: 'portfolio-planning',
                                title: 'تخطيط المشروع',
                                description: 'تخطيط وتصميم الموقع الشخصي',
                                duration: '35:20',
                                youtubeId: '0YFrGy_mzjY',
                                completed: false
                            }
                        ]
                    }
                ]
            }
        ]
    };


// ===== INITIALIZATION (أضف في initDashboard) =====
function initDashboard() {
    loadUserData();
    loadUserDataInSidebar();
    loadStages();
    updateTodayDate();
    updateQuickStats();
    setupEventListeners();
    setupSidebarNavigation();
    setupMobileMenu();
    calculateStatistics();
    initProgressCircles(); // ← أضف هذا السطر
    updateProgressIndicator(); // ← أضف هذا السطر
}

    // تحميل بيانات المستخدم
    function loadUserData() {
        const userAnswers = JSON.parse(localStorage.getItem('masarUserAnswers')) || {};
        
        const userName = localStorage.getItem('masarUserName') || 'كريم';
        document.getElementById('userName').textContent = userName;
        document.getElementById('greetingName').textContent = userName;

        setGreeting();
    }

    // دالة لتحميل بيانات المستخدم في الـ Sidebar
function loadUserDataInSidebar() {
    const userData = JSON.parse(localStorage.getItem('userData')) || 
                    JSON.parse(localStorage.getItem('masarUser'));
    
    if (userData) {
        // تحديث الاسم في الـ Sidebar (إذا كان موجوداً)
        const userNameElement = document.getElementById('dashboardUserName');
        if (userNameElement && userData.name) {
            userNameElement.textContent = `مرحباً، ${userData.name}`;
        }
        
        // تحديث الاسم في الـ Top Navbar (إذا كان موجوداً)
        const navUserName = document.getElementById('userNameNav');
        if (navUserName) {
            navUserName.textContent = userData.name;
        }
    }
}

    // تعيين التحية
    function setGreeting() {
        const hour = new Date().getHours();
        const greetingElement = document.getElementById('greetingText');
        
        let greeting = '';
        if (hour >= 5 && hour < 12) {
            greeting = 'صباح الخير! 🌅 وقت ممتاز لبدء التعلم';
        } else if (hour >= 12 && hour < 17) {
            greeting = 'مساء الخير! ☀️ استمر في التقدم';
        } else {
            greeting = 'مساء الخير! 🌙 استغل وقتك في التعلم';
        }
        
        greetingElement.textContent = greeting;
    }

    // تحميل المراحل
    function loadStages() {
        const stagesContainer = document.getElementById('stagesContainer');
        
        let stagesHTML = '';
        
        learningData.stages.forEach(stage => {
            stagesHTML += `
                <div class="stage-card" data-stage="${stage.id}">
                    <div class="stage-header" onclick="toggleStage('${stage.id}')">
                        <div class="stage-number">${stage.number}</div>
                        <div class="stage-info">
                            <h3>${stage.title}</h3>
                            <p>${stage.description}</p>
                        </div>
                        <div class="stage-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${stage.progress}%"></div>
                            </div>
                            <span>${stage.progress}%</span>
                        </div>
                        <i class="fas fa-chevron-down stage-toggle"></i>
                    </div>
                    
                    <div class="courses-container" id="courses-${stage.id}">
                        ${generateCoursesHTML(stage.courses, stage.id)}
                    </div>
                </div>
            `;
        });
        
        stagesContainer.innerHTML = stagesHTML;
        
        // فتح المرحلة الأولى تلقائياً
        setTimeout(() => {
            toggleStage('stage-1', true);
        }, 500);
    }

    // توليد HTML للكورسات
    function generateCoursesHTML(courses, stageId) {
        let coursesHTML = '';
        
        courses.forEach(course => {
            coursesHTML += `
                <div class="course-card" data-course="${course.id}">
                    <div class="course-header" onclick="toggleCourse('${stageId}', '${course.id}')">
                        <div class="course-icon">
                            <i class="${course.icon}"></i>
                        </div>
                        <div class="course-info">
                            <h4>${course.title}</h4>
                            <p>${course.description}</p>
                        </div>
                        <div class="course-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${course.progress}%"></div>
                            </div>
                            <span>${course.progress}%</span>
                        </div>
                        <i class="fas fa-chevron-down course-toggle"></i>
                    </div>
                    
                    <div class="lessons-container" id="lessons-${stageId}-${course.id}">
                        ${generateLessonsHTML(course.lessons, stageId, course.id)}
                    </div>
                </div>
            `;
        });
        
        return coursesHTML;
    }

   function generateLessonsHTML(lessons, stageId, courseId) {
    if (!lessons || lessons.length === 0) {
        return '<div class="empty-state"><p>لا توجد دروس متاحة بعد</p></div>';
    }
    
    let lessonsHTML = '';
    
    lessons.forEach((lesson, index) => {
        lessonsHTML += `
            <div class="lesson-item ${lesson.completed ? 'completed' : ''}" data-lesson="${lesson.id}">
                <div class="lesson-number">${index + 1}</div>
                <div class="lesson-content">
                    <h5>${lesson.title}</h5>
                    <p>${lesson.description}</p>
                    <div class="lesson-meta">
                        <span><i class="fas fa-clock"></i> ${lesson.duration}</span>
                        <span><i class="fas ${lesson.completed ? 'fa-check-circle success' : 'fa-play-circle primary'}"></i> ${lesson.completed ? 'مكتمل' : 'جديد'}</span>
                    </div>
                </div>
                <div class="lesson-action">
                    <button class="watch-btn" onclick="openVideoPlayer('${stageId}', '${courseId}', '${lesson.id}')">
                        <i class="fas fa-play"></i>
                        ${lesson.completed ? 'شاهد مرة أخرى' : 'شاهد الآن'}
                    </button>
                </div>
            </div>
        `;
    });
    
    return lessonsHTML;
}

    // تبديل فتح/إغلاق الكورس
    window.toggleCourse = function(stageId, courseId) {
        const courseCard = document.querySelector(`[data-stage="${stageId}"] [data-course="${courseId}"]`);
        const lessonsContainer = document.getElementById(`lessons-${stageId}-${courseId}`);
        const isActive = courseCard.classList.contains('active');
        
        if (!isActive) {
            // إغلاق جميع الكورسات الأخرى في نفس المرحلة
            document.querySelectorAll(`[data-stage="${stageId}"] .course-card`).forEach(card => {
                card.classList.remove('active');
                const container = card.querySelector('.lessons-container');
                if (container) {
                    container.style.display = 'none';
                }
            });
            
            // فتح هذا الكورس
            courseCard.classList.add('active');
            lessonsContainer.style.display = 'block';
            
            // تمرير سلس للكورس
            courseCard.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        } else {
            courseCard.classList.remove('active');
            lessonsContainer.style.display = 'none';
        }
    };

   // دالة فتح مشغل الفيديو من Dashboard
window.openVideoPlayer = function(stageId, courseId, lessonId) {
    // البحث عن بيانات الدرس
    const stage = learningData.stages.find(s => s.id === stageId);
    if (!stage) return;
    
    const course = stage.courses.find(c => c.id === courseId);
    if (!course) return;
    
    const lesson = course.lessons.find(l => l.id === lessonId);
    if (!lesson) return;
    
    // حفظ بيانات الجلسة
    const sessionData = {
        stage: {
            id: stage.id,
            title: stage.title,
            number: stage.number
        },
        course: {
            id: course.id,
            title: course.title,
            description: course.description,
            icon: course.icon
        },
        lesson: lesson,
        courseLessons: course.lessons,
        currentLessonIndex: course.lessons.findIndex(l => l.id === lessonId)
    };
    
    // حفظ في localStorage
    localStorage.setItem('currentVideoSession', JSON.stringify(sessionData));
    
    // إظهار رسالة تحميل
    showLoadingMessage('جاري فتح مشغل الفيديو...');
    
    // الانتقال بعد تأخير قصير
    setTimeout(() => {
        window.location.href = 'course-player.html';
    }, 500);
};

// دالة لإظهار رسالة تحميل
function showLoadingMessage(message) {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading-message';
    loadingDiv.innerHTML = `
        <div class="loading-content">
            <i class="fas fa-spinner fa-spin"></i>
            <p>${message}</p>
        </div>
    `;
    
    loadingDiv.style.cssText = `
        position: fixed;
        top: 0;
        right: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        color: white;
        font-size: 1.2rem;
    `;
    
    document.body.appendChild(loadingDiv);
    
    // إزالة الرسالة بعد 3 ثواني
    setTimeout(() => {
        if (loadingDiv.parentNode) {
            loadingDiv.parentNode.removeChild(loadingDiv);
        }
    }, 3000);
}

    // تحديث التاريخ
    function updateTodayDate() {
        const today = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        const dateString = today.toLocaleDateString('ar-SA', options);
        document.getElementById('todayDate').textContent = dateString;
    }



    // حساب الإحصائيات
    function calculateStatistics() {
        let completedStages = 0;
        let completedCourses = 0;
        let completedVideos = 0;
        let totalHours = 0;
        
        learningData.stages.forEach(stage => {
            // حساب المراحل المكتملة (75%+)
            if (stage.progress >= 75) {
                completedStages++;
            }
            
            stage.courses.forEach(course => {
                // حساب الكورسات المكتملة (100%)
                if (course.progress === 100) {
                    completedCourses++;
                }
                
                course.lessons.forEach(lesson => {
                    if (lesson.completed) {
                        completedVideos++;
                    }
                    
                    // حساب الساعات (تقريبي)
                    const [min, sec] = lesson.duration.split(':').map(Number);
                    totalHours += (min * 60 + sec) / 3600;
                });
            });
        });
        
        // تحديث الإحصائيات
        document.getElementById('completedStages').textContent = completedStages;
        document.getElementById('completedCourses').textContent = completedCourses;
        document.getElementById('completedVideos').textContent = completedVideos;
        document.getElementById('totalHours').textContent = Math.round(totalHours);
        
        // تحديث التقدم العام
        const totalLessons = learningData.stages.reduce((total, stage) => {
            return total + stage.courses.reduce((courseTotal, course) => {
                return courseTotal + course.lessons.length;
            }, 0);
        }, 0);
        
        const overallProgress = Math.round((completedVideos / totalLessons) * 100);
        document.getElementById('overallProgress').textContent = `${overallProgress}%`;
        document.getElementById('overallProgressFill').style.background = `conic-gradient(#3b82f6 0% ${overallProgress}%, #e2e8f0 ${overallProgress}% 100%)`;
    }

    // إعداد الأحداث
    function setupEventListeners() {
        // البحث العام
        document.getElementById('globalSearch').addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            
            if (!searchTerm) {
                // إظهار الكل
                document.querySelectorAll('.stage-card, .course-card, .lesson-item').forEach(el => {
                    el.style.display = '';
                });
                return;
            }


            
            // البحث في المراحل
            document.querySelectorAll('.stage-card').forEach(stage => {
                const stageTitle = stage.querySelector('.stage-info h3').textContent.toLowerCase();
                const stageDesc = stage.querySelector('.stage-info p').textContent.toLowerCase();
                
                if (stageTitle.includes(searchTerm) || stageDesc.includes(searchTerm)) {
                    stage.style.display = '';
                    // فتح المرحلة
                    const stageId = stage.dataset.stage;
                    if (!stage.classList.contains('active')) {
                        toggleStage(stageId);
                    }
                } else {
                    stage.style.display = 'none';
                }
            });
            
            // البحث في الكورسات
            document.querySelectorAll('.course-card').forEach(course => {
                const courseTitle = course.querySelector('.course-info h4').textContent.toLowerCase();
                const courseDesc = course.querySelector('.course-info p').textContent.toLowerCase();
                
                if (courseTitle.includes(searchTerm) || courseDesc.includes(searchTerm)) {
                    course.style.display = '';
                    // فتح المرحلة والكورس
                    const stageCard = course.closest('.stage-card');
                    const stageId = stageCard.dataset.stage;
                    const courseId = course.dataset.course;
                    
                    if (!stageCard.classList.contains('active')) {
                        toggleStage(stageId);
                    }
                    if (!course.classList.contains('active')) {
                        toggleCourse(stageId, courseId);
                    }
                } else {
                    course.style.display = 'none';
                }
            });
            
            // البحث في الدروس
            document.querySelectorAll('.lesson-item').forEach(lesson => {
                const lessonTitle = lesson.querySelector('.lesson-content h5').textContent.toLowerCase();
                const lessonDesc = lesson.querySelector('.lesson-content p').textContent.toLowerCase();
                
                if (lessonTitle.includes(searchTerm) || lessonDesc.includes(searchTerm)) {
                    lesson.style.display = 'flex';
                    
                    // فتح المرحلة والكورس
                    const courseCard = lesson.closest('.course-card');
                    const stageCard = courseCard.closest('.stage-card');
                    const stageId = stageCard.dataset.stage;
                    const courseId = courseCard.dataset.course;
                    
                    if (!stageCard.classList.contains('active')) {
                        toggleStage(stageId);
                    }
                    if (!courseCard.classList.contains('active')) {
                        toggleCourse(stageId, courseId);
                    }
                } else {
                    lesson.style.display = 'none';
                }
            });
        });
    }

    // دالة لإعداد التنقل في الـ Sidebar
function setupSidebarNavigation() {
    const menuItems = document.querySelectorAll('.sidebar-menu a');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // إذا كان رابط داخلي (#)
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                scrollToSection(targetId);
            }
            // إذا كان رابط خارجي (لمشغل الفيديو، الإعدادات، الخ)
            // ينتقل تلقائياً بدون أي معالجة
        });
    });
}

// دالة للتمرير للأقسام
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
        
        // تحديث العنصر النشط في القائمة
        document.querySelectorAll('.sidebar-menu li').forEach(li => {
            li.classList.remove('active');
        });
        
        // إضافة active للعنصر الحالي
        const activeItem = event.target.closest('li');
        if (activeItem) {
            activeItem.classList.add('active');
        }
    }
}

// ===== ROADMAP FUNCTIONS (أضف في نهاية الملف) =====

// تهيئة دوائر التقدم
function initProgressCircles() {
    document.querySelectorAll('.progress-circle-mini').forEach(circle => {
        const progress = parseInt(circle.getAttribute('data-progress'));
        const circleElement = circle.querySelector('.progress-circle');
        const circumference = 170; // 2 * π * 27
        const offset = circumference - (progress / 100) * circumference;
        circleElement.style.strokeDashoffset = offset;
    });
}

// عرض نافذة الـ Roadmap
window.showRoadmapModal = function() {
    const modal = document.getElementById('roadmapModal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // تحميل محتوى الـ Roadmap التفصيلي
    loadDetailedRoadmap();
};

// إغلاق النافذة
window.closeRoadmap = function() {
    const modal = document.getElementById('roadmapModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
};

// تحميل الـ Roadmap التفصيلي
function loadDetailedRoadmap() {
    const modalContent = document.querySelector('.roadmap-content');
    
    // إزالة المحتوى القديم إن وجد
    const oldContent = modalContent.querySelector('.detailed-roadmap');
    if (oldContent) {
        oldContent.remove();
    }
    
    // إنشاء محتوى جديد
    const detailedHTML = `
        <div class="detailed-roadmap">
            <!-- سيتم إنشاء المحتوى ديناميكياً -->
        </div>
    `;
    
    modalContent.insertAdjacentHTML('beforeend', detailedHTML);
}

// بدء التعلم
window.startLearning = function() {
    // البحث عن الدرس التالي غير المكتمل
    const nextLesson = findNextLesson();
    
    if (nextLesson) {
        // حفظ بيانات الدرس للانتقال إلى مشغل الفيديو
        const sessionData = {
            stage: nextLesson.stage,
            course: nextLesson.course,
            lesson: nextLesson.lesson,
            courseLessons: nextLesson.course.lessons,
            currentLessonIndex: nextLesson.course.lessons.findIndex(l => l.id === nextLesson.lesson.id)
        };
        
        localStorage.setItem('currentVideoSession', JSON.stringify(sessionData));
        
        // الانتقال إلى مشغل الفيديو
        window.location.href = 'course-player.html';
    } else {
        alert('🎉 مبروك! لقد أكملت جميع الدروس!');
    }
};

// البحث عن الدرس التالي
function findNextLesson() {
    // هنا يمكنك إضافة منطق البحث عن الدرس التالي غير المكتمل
    return null; // قم بتنفيذ المنطق حسب بياناتك
}

// تحديث مؤشر التقدم
function updateProgressIndicator() {
    const overallProgress = calculateOverallProgress();
    const indicatorFill = document.querySelector('.indicator-fill');
    const indicatorPercent = document.querySelector('.indicator-percent');
    
    if (indicatorFill) {
        indicatorFill.style.width = `${overallProgress}%`;
    }
    
    if (indicatorPercent) {
        indicatorPercent.textContent = `${overallProgress}%`;
    }
}

// حساب التقدم العام
function calculateOverallProgress() {
    // قم بتنفيذ منطق حساب التقدم من بياناتك
    return 35; // قيمة تجريبية
}



// دالة للتحكم في الـ Sidebar على الموبايل
function setupMobileMenu() {
    const mobileToggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (mobileToggle && sidebar) {
        mobileToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            mobileToggle.innerHTML = sidebar.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
        
        // إغلاق الـ Sidebar عند النقر على رابط
        document.querySelectorAll('.menu-link').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('active');
                    mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
                }
            });
        });
    }
}



    // تسجيل الخروج
    window.logout = function() {
        if (confirm('هل تريد تسجيل الخروج؟')) {
            localStorage.removeItem('masarUserAnswers');
            localStorage.removeItem('masarOnboardingCompleted');
            window.location.href = 'index.html';
        }
    };

    // البدء
    initDashboard();
});