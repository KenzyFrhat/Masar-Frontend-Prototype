// roadmap.js - الإصدار المحسن مع إصلاح كامل
// ==============================================

// متغيرات عامة
let currentUserData = null;
let currentProgressData = null;
let currentOnboardingData = null;

// تهيئة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 تحميل صفحة خطة التعلم...');
    initRoadmap();
});

// ===== تهيئة صفحة الـ Roadmap =====
function initRoadmap() {
    console.log('🎯 تهيئة Roadmap...');
    
    // انتظر StateManager إذا كان متاحاً
    if (typeof StateManager !== 'undefined') {
        console.log('🔄 استخدام StateManager...');
        StateManager.init();
        setTimeout(() => {
            setupRoadmap();
        }, 300);
    } else {
        console.warn('⚠️ StateManager غير متاح، استخدام البيانات المحلية');
        setupRoadmap();
    }
}

// ===== إعداد صفحة الـ Roadmap =====
function setupRoadmap() {
    console.log('🛠️ إعداد Roadmap...');
    
    // 1. تحميل بيانات المستخدم
    loadUserData();
    
    // 2. تحميل البيانات التعليمية
    loadLearningData();
    
    // 3. إعداد دوائر التقدم
    initProgressCircles();
    
    // 4. إعداد الأحداث
    setupEventListeners();
    
    // 5. إعداد التنقل
    setupRoadmapNavigation();
    
    // 6. إعداد زر الـ Sidebar
    setupSidebarToggle();
    
    // 7. فتح المرحلة الأولى تلقائياً
    setTimeout(() => {
        if (window.location.hash) {
            const stageId = window.location.hash.substring(1);
            if (stageId) toggleStage(stageId, true);
        } else {
            toggleStage('stage-1', true);
        }
    }, 500);
    
    console.log('✅ تم إعداد Roadmap بنجاح');
}

// ===== تحميل بيانات المستخدم =====
function loadUserData() {
    console.log('👤 تحميل بيانات المستخدم...');
    
    try {
        // استخدام StateManager إذا كان متاحاً
        if (typeof StateManager !== 'undefined') {
            currentUserData = StateManager.getUser();
            currentProgressData = StateManager.getProgress();
            currentOnboardingData = StateManager.getOnboarding();
        } else {
            // استخدام البيانات المحلية
            currentUserData = JSON.parse(localStorage.getItem('masarUser')) || 
                           JSON.parse(localStorage.getItem('masarUserAnswers')) || 
                           JSON.parse(localStorage.getItem('userData')) || {
                               name: 'محمد',
                               level: 'مبتدئ'
                           };
            
            currentProgressData = JSON.parse(localStorage.getItem('masarProgress')) || 
                                JSON.parse(localStorage.getItem('userProgress')) || {
                                    streak: 3,
                                    totalHours: 12,
                                    completedCourses: 8,
                                    overall: 35
                                };
            
            currentOnboardingData = JSON.parse(localStorage.getItem('masarOnboarding')) || {
                results: {
                    goals: ['تطوير ويب'],
                    timeAvailability: 60
                }
            };
        }
        
        // تحديث معلومات المستخدم
        updateUserInfo();
        
        console.log('✅ تم تحميل بيانات المستخدم');
    } catch (error) {
        console.error('❌ خطأ في تحميل بيانات المستخدم:', error);
        // استخدام بيانات افتراضية
        currentUserData = { name: 'محمد', level: 'مبتدئ' };
        currentProgressData = { streak: 3, totalHours: 12, completedCourses: 8, overall: 35 };
        currentOnboardingData = { results: { goals: ['تطوير ويب'], timeAvailability: 60 } };
        updateUserInfo();
    }
}

// ===== تحديث معلومات المستخدم في الواجهة =====
function updateUserInfo() {
    const userName = currentUserData.name || 'محمد';
    document.getElementById('roadmapUserName').textContent = `مرحباً، ${userName}`;
    
    // تحديث شارة التخصص
    const specialization = currentOnboardingData.results?.goals?.[0] || 'تطوير ويب';
    const specializationElement = document.getElementById('userSpecialization');
    if (specializationElement) {
        const icon = getSpecializationIcon(specialization);
        specializationElement.innerHTML = `<i class="${icon}"></i><span>${specialization}</span>`;
    }
    
    // تحديث الرسالة الترحيبية
    const greetingText = document.getElementById('greetingText');
    if (greetingText) {
        const greetingMessages = [
            `مرحباً ${userName}! هذا المسار مصمم خصيصاً لك بناءً على أهدافك`,
            `${userName}، أنت على الطريق الصحيح نحو الاحتراف`,
            `استمر في التقدم ${userName}! هذا المسار يناسب مهاراتك`,
            `${userName}، هذا المسار سيساعدك في تحقيق أهدافك`
        ];
        greetingText.textContent = greetingMessages[Math.floor(Math.random() * greetingMessages.length)];
    }
    
    // تحديث الإحصائيات
    updateRoadmapStats();
    
    // تحديث الهدف التعليمي
    updateLearningGoal();
}

// ===== الحصول على أيقونة التخصص =====
function getSpecializationIcon(specialization) {
    const icons = {
        'تطوير ويب': 'fas fa-laptop-code',
        'برمجة': 'fas fa-code',
        'تصميم': 'fas fa-paint-brush',
        'بيانات': 'fas fa-database',
        'أمن': 'fas fa-shield-alt',
        'ذكاء اصطناعي': 'fas fa-robot',
        'جوال': 'fas fa-mobile-alt'
    };
    
    for (const [key, icon] of Object.entries(icons)) {
        if (specialization.includes(key)) {
            return icon;
        }
    }
    
    return 'fas fa-graduation-cap';
}

// ===== تحديث إحصائيات المستخدم =====
function updateRoadmapStats() {
    console.log('📊 تحديث إحصائيات المستخدم...');
    
    const streakDays = currentProgressData.streak || 3;
    const totalHours = Math.round(currentProgressData.totalHours || 12);
    const completedLessons = currentProgressData.completedCourses || 8;
    const overallProgress = currentProgressData.overall || 35;
    
    document.getElementById('roadmapStreakDays').textContent = streakDays;
    document.getElementById('roadmapTotalHours').textContent = totalHours;
    document.getElementById('roadmapCompleted').textContent = completedLessons;
    document.getElementById('currentProgress').textContent = `${overallProgress}%`;
    
    // تحديث وقت الإكمال المقدر
    const dailyMinutes = 60; // دقيقة يومياً
    const totalHoursNeeded = 120;
    const remainingHours = totalHoursNeeded - totalHours;
    const daysNeeded = Math.ceil((remainingHours * 60) / dailyMinutes);
    
    const estimatedDuration = document.getElementById('estimatedDuration');
    if (estimatedDuration) {
        if (daysNeeded <= 30) {
            estimatedDuration.textContent = `${Math.ceil(daysNeeded / 7)} أسابيع`;
        } else {
            estimatedDuration.textContent = `${Math.ceil(daysNeeded / 30)} أشهر`;
        }
    }
}

// ===== تحديث الهدف التعليمي =====
function updateLearningGoal() {
    console.log('🎯 تحديث الهدف التعليمي...');
    
    const goalElement = document.getElementById('learningGoal');
    if (!goalElement) return;
    
    const goals = currentOnboardingData.results?.goals || ['تطوير ويب'];
    const timeAvailability = currentOnboardingData.results?.timeAvailability || 60;
    
    let goalText = '';
    
    if (goals.includes('تطوير ويب')) {
        if (timeAvailability >= 120) {
            goalText = 'مطور ويب كامل Stack';
        } else if (timeAvailability >= 60) {
            goalText = 'مطور Frontend محترف';
        } else {
            goalText = 'مطور ويب مبتدئ';
        }
    } else if (goals.includes('برمجة')) {
        goalText = 'مبرمج محترف';
    } else if (goals.includes('تصميم')) {
        goalText = 'مصمم واجهات مستخدم';
    } else {
        goalText = 'متخصص تقني';
    }
    
    goalElement.textContent = goalText;
}

// ===== تحميل البيانات التعليمية =====
function loadLearningData() {
    console.log('📚 تحميل البيانات التعليمية...');
    
    const stagesContainer = document.getElementById('roadmapStages');
    if (!stagesContainer) return;
    
    // بيانات المراحل
    const learningData = getLearningData();
    
    // إضافة كل مرحلة
    learningData.stages.forEach(stage => {
        const stageElement = createStageElement(stage);
        stagesContainer.appendChild(stageElement);
        
        // إضافة الكورسات للمرحلة
        const coursesContainer = stageElement.querySelector('.courses-container');
        stage.courses.forEach(course => {
            const courseElement = createCourseElement(stage.id, course);
            coursesContainer.appendChild(courseElement);
        });
    });
    
    console.log(`✅ تم تحميل ${learningData.stages.length} مراحل تعليمية`);
}

// ===== إنشاء عنصر المرحلة =====
function createStageElement(stage) {
    const template = document.getElementById('stageTemplate');
    const clone = template.content.cloneNode(true);
    const stageElement = clone.querySelector('.roadmap-stage-card');
    
    stageElement.id = `stage-${stage.id}`;
    stageElement.querySelector('.stage-badge span').textContent = `المرحلة ${stage.number}`;
    stageElement.querySelector('.stage-title h2 i').className = stage.icon;
    stageElement.querySelector('.stage-title h2').innerHTML = `<i class="${stage.icon}"></i> ${stage.title}`;
    stageElement.querySelector('.stage-title p').textContent = stage.description;
    
    const progressCircle = stageElement.querySelector('.progress-circle');
    progressCircle.setAttribute('data-progress', stage.progress);
    progressCircle.querySelector('span').textContent = `${stage.progress}%`;
    
    // إضافة حدث النقر
    const stageHeader = stageElement.querySelector('.stage-header');
    stageHeader.addEventListener('click', function(e) {
        if (e.target.closest('.stage-header')) {
            toggleStage(stage.id, false);
        }
    });
    
    return stageElement;
}

// ===== إنشاء عنصر الكورس =====
function createCourseElement(stageId, course) {
    const template = document.getElementById('courseTemplate');
    const clone = template.content.cloneNode(true);
    const courseElement = clone.querySelector('.course-card');
    
    courseElement.id = `course-${course.id}`;
    courseElement.querySelector('.course-icon i').className = course.icon;
    courseElement.querySelector('.course-info h3').textContent = course.title;
    courseElement.querySelector('.course-info p').textContent = `${course.description} - ${course.progress}% مكتمل`;
    
    const buttonText = course.progress === 0 ? 'بدء الكورس' : 
                       course.progress === 100 ? 'مراجعة الكورس' : 'استكمال الكورس';
    const startBtn = courseElement.querySelector('.btn-start-course');
    startBtn.innerHTML = `<i class="fas fa-play"></i> ${buttonText}`;
    startBtn.dataset.course = course.id;
    startBtn.dataset.stage = stageId;
    
    // إضافة حدث النقر للرأس
    const courseHeader = courseElement.querySelector('.course-header');
    courseHeader.addEventListener('click', function(e) {
        if (!e.target.closest('.btn-start-course')) {
            toggleCourse(stageId, course.id);
        }
    });
    
    // إضافة الدروس للكورس
    const lessonsContainer = courseElement.querySelector('.lessons-container');
    course.lessons.forEach((lesson, index) => {
        const lessonElement = createLessonElement(stageId, course.id, lesson, index + 1);
        lessonsContainer.appendChild(lessonElement);
    });
    
    return courseElement;
}

// ===== إنشاء عنصر الدرس =====
function createLessonElement(stageId, courseId, lesson, number) {
    const template = document.getElementById('lessonTemplate');
    const clone = template.content.cloneNode(true);
    const lessonElement = clone.querySelector('.lesson-item');
    
    lessonElement.id = `lesson-${lesson.id}`;
    if (lesson.completed) lessonElement.classList.add('completed');
    
    lessonElement.querySelector('.lesson-number').textContent = number;
    lessonElement.querySelector('.lesson-header h4').textContent = lesson.title;
    lessonElement.querySelector('.lesson-duration').innerHTML = `<i class="fas fa-clock"></i> ${lesson.duration}`;
    lessonElement.querySelector('.lesson-content p').textContent = lesson.description;
    
    const statusElement = lessonElement.querySelector('.lesson-status');
    const actionsContainer = lessonElement.querySelector('.lesson-actions');
    
    if (lesson.completed) {
        statusElement.classList.add('completed');
        statusElement.textContent = 'مكتمل';
        actionsContainer.innerHTML = `
            <button class="btn-review" data-lesson="${lesson.id}" data-course="${courseId}" data-stage="${stageId}">
                <i class="fas fa-redo"></i>
                مراجعة
            </button>
            <button class="btn-notes" data-lesson="${lesson.id}">
                <i class="fas fa-sticky-note"></i>
                ملاحظات
            </button>
        `;
    } else {
        statusElement.classList.add('pending');
        statusElement.textContent = 'قيد الانتظار';
        actionsContainer.innerHTML = `
            <button class="btn-start" data-lesson="${lesson.id}" data-course="${courseId}" data-stage="${stageId}">
                <i class="fas fa-play"></i>
                بدء الدرس
            </button>
        `;
    }
    
    return lessonElement;
}

// ===== الحصول على بيانات التعلم =====
function getLearningData() {
    return {
        stages: [
            {
                id: '1',
                number: 1,
                title: 'أساسيات البرمجة',
                description: 'بناء الأساس القوي في البرمجة - 4 أسابيع',
                icon: 'fas fa-rocket',
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
                                description: 'تعلم أساسيات HTML لبناء هيكل صفحات الويب',
                                duration: '30:15',
                                completed: true,
                                youtubeId: 'qz0aGYrrlhU'
                            },
                            {
                                id: 'css-fundamentals',
                                title: 'أساسيات CSS',
                                description: 'تصميم وتنسيق صفحات الويب باستخدام CSS',
                                duration: '45:30',
                                completed: true,
                                youtubeId: '1PnVor36_40'
                            },
                            {
                                id: 'responsive-design',
                                title: 'التصميم المتجاوب',
                                description: 'جعل المواقع تعمل على جميع الأجهزة',
                                duration: '42:30',
                                completed: true,
                                youtubeId: 'srvUrASNj0s'
                            }
                        ]
                    },
                    {
                        id: 'javascript',
                        title: 'JavaScript الأساسي',
                        description: 'ابدأ رحلتك في برمجة JavaScript',
                        icon: 'fab fa-js-square',
                        progress: 50,
                        lessons: [
                            {
                                id: 'js-intro',
                                title: 'مقدمة JavaScript',
                                description: 'تعلم البرمجة بلغة JavaScript من الصفر',
                                duration: '1:05:20',
                                completed: true,
                                youtubeId: 'W6NZfCO5SIk'
                            },
                            {
                                id: 'js-functions',
                                title: 'الدوال في JavaScript',
                                description: 'كيفية كتابة واستخدام الدوال بكفاءة',
                                duration: '40:00',
                                completed: false,
                                youtubeId: 'Mus_vwhTCq0'
                            },
                            {
                                id: 'js-arrays',
                                title: 'المصفوفات في JavaScript',
                                description: 'كيفية التعامل مع المصفوفات والبيانات',
                                duration: '35:45',
                                completed: false,
                                youtubeId: '7W4pQQ20nJg'
                            }
                        ]
                    },
                    {
                        id: 'git',
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
                                completed: false,
                                youtubeId: 'RGOj5yH7evk'
                            }
                        ]
                    }
                ]
            },
            {
                id: '2',
                number: 2,
                title: 'تطوير الويب المتقدم',
                description: 'بناء تطبيقات ويب متقدمة - 8 أسابيع',
                icon: 'fas fa-code',
                progress: 20,
                courses: [
                    {
                        id: 'react',
                        title: 'React.js للمبتدئين',
                        description: 'تعلم بناء واجهات مستخدم تفاعلية',
                        icon: 'fab fa-react',
                        progress: 20,
                        lessons: [
                            {
                                id: 'react-intro',
                                title: 'مقدمة إلى React',
                                description: 'تعلم أساسيات مكتبة React الحديثة',
                                duration: '55:00',
                                completed: false,
                                youtubeId: 'w7ejDZ8SWv8'
                            },
                            {
                                id: 'react-components',
                                title: 'مكونات React',
                                description: 'كيفية إنشاء وإدارة المكونات',
                                duration: '48:30',
                                completed: false,
                                youtubeId: 'Y2hgEGPzTZY'
                            }
                        ]
                    },
                    {
                        id: 'nodejs',
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
                                completed: false,
                                youtubeId: 'TlB_eWDSMt4'
                            }
                        ]
                    }
                ]
            },
            {
                id: '3',
                number: 3,
                title: 'مشاريع عملية',
                description: 'بناء مشاريع حقيقية وتطبيق المعرفة - 4 أسابيع',
                icon: 'fas fa-briefcase',
                progress: 0,
                courses: [
                    {
                        id: 'portfolio',
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
                                completed: false,
                                youtubeId: '0YFrGy_mzjY'
                            }
                        ]
                    }
                ]
            }
        ]
    };
}

// ===== إعداد دوائر التقدم =====
function initProgressCircles() {
    console.log('🔄 إعداد دوائر التقدم...');
    
    document.querySelectorAll('.progress-circle').forEach(circle => {
        const progress = parseInt(circle.getAttribute('data-progress')) || 0;
        const circleElement = circle.querySelector('.progress-bar');
        const circumference = 2 * Math.PI * 27;
        const offset = circumference - (progress / 100) * circumference;
        
        circleElement.style.strokeDasharray = `${circumference} ${circumference}`;
        circleElement.style.strokeDashoffset = offset;
    });
}

// ===== إعداد الأحداث =====
function setupEventListeners() {
    console.log('🎮 إعداد الأحداث...');
    
    // البحث في الـ Roadmap
    setupSearch();
    
    // تحديث دوائر التقدم عند التمرير
    window.addEventListener('scroll', function() {
        updateVisibleProgressCircles();
    });
    
    // تحديث دوائر التقدم عند تغيير الحجم
    window.addEventListener('resize', function() {
        initProgressCircles();
    });
    
    // أحداث النقر على الأزرار
    setupButtonEvents();
}

// ===== إعداد أحداث الأزرار =====
function setupButtonEvents() {
    // تسجيل الخروج
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // الطباعة
    const printBtn = document.getElementById('printBtn');
    if (printBtn) {
        printBtn.addEventListener('click', printRoadmap);
    }
    
    // المشاركة
    const shareBtn = document.getElementById('shareBtn');
    if (shareBtn) {
        shareBtn.addEventListener('click', shareRoadmap);
    }
    
    // الصورة الشخصية
    const avatar = document.querySelector('.user-avatar-large');
    if (avatar) {
        avatar.addEventListener('click', goToProfile);
    }
    
    // التفويضات (Delegation) لأزرار الدروس
    document.addEventListener('click', function(e) {
        // بدء/مراجعة الدرس
        if (e.target.closest('.btn-start') || e.target.closest('.btn-review')) {
            const button = e.target.closest('.btn-start') || e.target.closest('.btn-review');
            const lessonId = button.dataset.lesson;
            const courseId = button.dataset.course;
            const stageId = button.dataset.stage;
            openVideo(stageId, courseId, lessonId);
        }
        
        // الملاحظات
        if (e.target.closest('.btn-notes')) {
            const button = e.target.closest('.btn-notes');
            const lessonId = button.dataset.lesson;
            openNotes(lessonId);
        }
        
        // بدء الكورس
        if (e.target.closest('.btn-start-course')) {
            const button = e.target.closest('.btn-start-course');
            const courseId = button.dataset.course;
            const stageId = button.dataset.stage;
            startCourse(stageId, courseId);
        }
    });
}

// ===== إعداد البحث =====
function setupSearch() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = '🔍 ابحث في الدروس والكورسات...';
    searchInput.className = 'roadmap-search';
    searchInput.style.cssText = `
        margin: 20px auto;
        padding: 12px 20px 12px 50px;
        width: 90%;
        max-width: 500px;
        display: block;
        border: 2px solid #e2e8f0;
        border-radius: 25px;
        font-family: 'Tajawal', sans-serif;
        font-size: 1rem;
        background: white url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2364768b"><path d="M23.707,22.293l-5.969-5.969a10.016,10.016,0,1,0-1.414,1.414l5.969,5.969a1,1,0,0,0,1.414-1.414ZM10,18a8,8,0,1,1,8-8A8.009,8.009,0,0,1,10,18Z"/></svg>') no-repeat 20px center;
        background-size: 20px;
        transition: all 0.3s ease;
    `;
    
    const roadmapSection = document.querySelector('.roadmap-stages-section');
    if (roadmapSection) {
        roadmapSection.parentNode.insertBefore(searchInput, roadmapSection);
        
        searchInput.addEventListener('input', function() {
            performSearch(this.value.toLowerCase().trim());
        });
        
        searchInput.addEventListener('focus', function() {
            this.style.borderColor = '#6366f1';
            this.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
        });
        
        searchInput.addEventListener('blur', function() {
            this.style.borderColor = '#e2e8f0';
            this.style.boxShadow = 'none';
        });
    }
}

// ===== تنفيذ البحث =====
function performSearch(searchTerm) {
    if (!searchTerm) {
        // إظهار الكل
        document.querySelectorAll('.roadmap-stage-card, .course-card, .lesson-item').forEach(el => {
            el.style.display = '';
        });
        return;
    }
    
    // البحث في المراحل
    document.querySelectorAll('.roadmap-stage-card').forEach(stage => {
        const stageTitle = stage.querySelector('.stage-title h2')?.textContent.toLowerCase() || '';
        const stageDesc = stage.querySelector('.stage-title p')?.textContent.toLowerCase() || '';
        
        if (stageTitle.includes(searchTerm) || stageDesc.includes(searchTerm)) {
            stage.style.display = '';
            // فتح المرحلة
            if (!stage.classList.contains('active')) {
                const stageId = stage.id.replace('stage-', '');
                toggleStage(stageId, true);
            }
        } else {
            stage.style.display = 'none';
        }
    });
    
    // البحث في الكورسات
    document.querySelectorAll('.course-card').forEach(course => {
        const courseTitle = course.querySelector('.course-info h3')?.textContent.toLowerCase() || '';
        const courseDesc = course.querySelector('.course-info p')?.textContent.toLowerCase() || '';
        
        if (courseTitle.includes(searchTerm) || courseDesc.includes(searchTerm)) {
            course.style.display = '';
            // فتح المرحلة والكورس
            const stageCard = course.closest('.roadmap-stage-card');
            const stageId = stageCard.id.replace('stage-', '');
            const courseId = course.id.replace('course-', '');
            
            if (!stageCard.classList.contains('active')) {
                toggleStage(stageId, true);
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
        const lessonTitle = lesson.querySelector('.lesson-content h4')?.textContent.toLowerCase() || '';
        const lessonDesc = lesson.querySelector('.lesson-content p')?.textContent.toLowerCase() || '';
        
        if (lessonTitle.includes(searchTerm) || lessonDesc.includes(searchTerm)) {
            lesson.style.display = 'flex';
            
            // فتح المرحلة والكورس
            const courseCard = lesson.closest('.course-card');
            const stageCard = courseCard.closest('.roadmap-stage-card');
            const stageId = stageCard.id.replace('stage-', '');
            const courseId = courseCard.id.replace('course-', '');
            
            if (!stageCard.classList.contains('active')) {
                toggleStage(stageId, true);
            }
            if (!courseCard.classList.contains('active')) {
                toggleCourse(stageId, courseId);
            }
        } else {
            lesson.style.display = 'none';
        }
    });
}

// ===== تحديث دوائر التقدم المرئية =====
function updateVisibleProgressCircles() {
    document.querySelectorAll('.progress-circle').forEach(circle => {
        const rect = circle.getBoundingClientRect();
        const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
        
        if (isVisible) {
            circle.classList.add('animated');
        }
    });
}

// ===== دالة فتح المرحلة =====
function toggleStage(stageId, forceOpen = false) {
    console.log(`🔧 محاولة فتح المرحلة: stage-${stageId}`);
    
    const stageCard = document.getElementById(`stage-${stageId}`);
    if (!stageCard) {
        console.error(`❌ لم يتم العثور على المرحلة: stage-${stageId}`);
        return;
    }
    
    const coursesContainer = stageCard.querySelector('.courses-container');
    if (!coursesContainer) {
        console.error(`❌ لم يتم العثور على حاوية الكورسات للمرحلة: stage-${stageId}`);
        return;
    }
    
    const arrowIcon = stageCard.querySelector('.stage-badge i');
    const isActive = stageCard.classList.contains('active');
    
    if (forceOpen || !isActive) {
        console.log(`📂 فتح المرحلة: stage-${stageId}`);
        
        // إغلاق جميع المراحل الأخرى
        document.querySelectorAll('.roadmap-stage-card').forEach(card => {
            if (card.id !== `stage-${stageId}`) {
                card.classList.remove('active');
                const container = card.querySelector('.courses-container');
                if (container) container.classList.remove('show');
                const otherArrow = card.querySelector('.stage-badge i');
                if (otherArrow) otherArrow.className = 'fas fa-chevron-down';
            }
        });
        
        // فتح هذه المرحلة
        stageCard.classList.add('active');
        coursesContainer.classList.add('show');
        
        if (arrowIcon) {
            arrowIcon.className = 'fas fa-chevron-up';
        }
        
        // تخزين في URL
        window.location.hash = `stage-${stageId}`;
        
        // تمرير سلس للمرحلة
        setTimeout(() => {
            stageCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
    } else {
        console.log(`📂 إغلاق المرحلة: stage-${stageId}`);
        stageCard.classList.remove('active');
        coursesContainer.classList.remove('show');
        
        if (arrowIcon) {
            arrowIcon.className = 'fas fa-chevron-down';
        }
    }
}

// ===== دالة فتح الكورس =====
function toggleCourse(stageId, courseId) {
    console.log(`🔧 محاولة فتح الكورس: course-${courseId}`);
    
    const courseCard = document.getElementById(`course-${courseId}`);
    if (!courseCard) {
        console.error(`❌ لم يتم العثور على الكورس: course-${courseId}`);
        return;
    }
    
    const lessonsContainer = courseCard.querySelector('.lessons-container');
    if (!lessonsContainer) {
        console.error(`❌ لم يتم العثور على حاوية الدروس للكورس: course-${courseId}`);
        return;
    }
    
    const arrowIcon = courseCard.querySelector('.course-toggle');
    const isActive = courseCard.classList.contains('active');
    
    if (!isActive) {
        console.log(`📂 فتح الكورس: course-${courseId}`);
        
        // إغلاق جميع الكورسات الأخرى في نفس المرحلة
        const stageCard = document.getElementById(`stage-${stageId}`);
        if (stageCard) {
            const allCourses = stageCard.querySelectorAll('.course-card');
            allCourses.forEach(course => {
                if (course.id !== `course-${courseId}`) {
                    course.classList.remove('active');
                    const container = course.querySelector('.lessons-container');
                    if (container) container.classList.remove('show');
                    const otherArrow = course.querySelector('.course-toggle');
                    if (otherArrow) otherArrow.className = 'fas fa-chevron-down';
                }
            });
        }
        
        // فتح هذا الكورس
        courseCard.classList.add('active');
        lessonsContainer.classList.add('show');
        
        if (arrowIcon) {
            arrowIcon.className = 'fas fa-chevron-up';
        }
    } else {
        console.log(`📂 إغلاق الكورس: course-${courseId}`);
        courseCard.classList.remove('active');
        lessonsContainer.classList.remove('show');
        
        if (arrowIcon) {
            arrowIcon.className = 'fas fa-chevron-down';
        }
    }
}

// ===== بدء الكورس =====
function startCourse(stageId, courseId) {
    console.log(`🚀 بدء الكورس: ${courseId}`);
    
    const courseCard = document.getElementById(`course-${courseId}`);
    if (!courseCard) return;
    
    // فتح أول درس غير مكتمل
    const firstIncompleteLesson = courseCard.querySelector('.lesson-item:not(.completed)');
    if (firstIncompleteLesson) {
        const lessonId = firstIncompleteLesson.id.replace('lesson-', '');
        openVideo(stageId, courseId, lessonId);
    } else {
        // إذا كانت كل الدروس مكتملة، افتح أول درس
        const firstLesson = courseCard.querySelector('.lesson-item');
        if (firstLesson) {
            const lessonId = firstLesson.id.replace('lesson-', '');
            openVideo(stageId, courseId, lessonId);
        }
    }
}

// ===== فتح فيديو =====
function openVideo(stageId, courseId, lessonId) {
    console.log(`🎥 فتح الفيديو: ${lessonId}`);
    
    // بيانات الفيديوهات
    const videoData = getVideoData(lessonId);
    if (!videoData) {
        showNotification('❌ لم يتم العثور على بيانات الفيديو', 'error');
        return;
    }
    
    // جمع بيانات المرحلة والكورس
    const stageCard = document.getElementById(`stage-${stageId}`);
    const courseCard = document.getElementById(`course-${courseId}`);
    
    if (!stageCard || !courseCard) {
        showNotification('❌ خطأ في تحميل بيانات الدورة', 'error');
        return;
    }
    
    const sessionData = {
        stage: {
            id: stageId,
            title: stageCard.querySelector('.stage-title h2')?.textContent.replace('🔗', '').trim() || '',
            number: parseInt(stageId)
        },
        course: {
            id: courseId,
            title: courseCard.querySelector('.course-info h3')?.textContent || '',
            description: courseCard.querySelector('.course-info p')?.textContent || '',
            icon: courseCard.querySelector('.course-icon i')?.className || ''
        },
        lesson: {
            id: lessonId,
            title: videoData.title,
            description: videoData.description,
            youtubeId: videoData.youtubeId,
            duration: videoData.duration || '30:00'
        },
        courseLessons: getCourseLessons(courseId),
        currentLessonIndex: getLessonIndex(courseId, lessonId),
        startTime: new Date().toISOString()
    };
    
    // حفظ في StateManager إذا كان متاحاً
    if (typeof StateManager !== 'undefined') {
        StateManager.updateLessonProgress(lessonId, false);
        StateManager.logLearningTime(parseInt(videoData.duration.split(':')[0]) || 30);
    }
    
    // حفظ في localStorage
    localStorage.setItem('currentVideoSession', JSON.stringify(sessionData));
    
    showLoading('جاري فتح مشغل الفيديو...');
    
    // الانتقال بعد تأخير قصير
    setTimeout(() => {
        console.log('🔄 الانتقال إلى course-player.html');
        window.location.href = 'course-player.html';
    }, 800);
}

// ===== الحصول على بيانات الفيديو =====
function getVideoData(lessonId) {
    const videoData = {
        'html-basics': {
            youtubeId: 'qz0aGYrrlhU',
            title: 'مقدمة إلى HTML',
            description: 'تعلم أساسيات HTML لبناء هيكل صفحات الويب',
            duration: '30:15'
        },
        'css-fundamentals': {
            youtubeId: '1PnVor36_40',
            title: 'أساسيات CSS',
            description: 'تصميم وتنسيق صفحات الويب باستخدام CSS',
            duration: '45:30'
        },
        'responsive-design': {
            youtubeId: 'srvUrASNj0s',
            title: 'التصميم المتجاوب',
            description: 'جعل المواقع تعمل على جميع الأجهزة',
            duration: '42:30'
        },
        'js-intro': {
            youtubeId: 'W6NZfCO5SIk',
            title: 'مقدمة JavaScript',
            description: 'تعلم البرمجة بلغة JavaScript من الصفر',
            duration: '1:05:20'
        },
        'js-functions': {
            youtubeId: 'Mus_vwhTCq0',
            title: 'الدوال في JavaScript',
            description: 'كيفية كتابة واستخدام الدوال بكفاءة',
            duration: '40:00'
        },
        'js-arrays': {
            youtubeId: '7W4pQQ20nJg',
            title: 'المصفوفات في JavaScript',
            description: 'كيفية التعامل مع المصفوفات والبيانات',
            duration: '35:45'
        },
        'git-basics': {
            youtubeId: 'RGOj5yH7evk',
            title: 'مقدمة إلى Git',
            description: 'أساسيات نظام التحكم في الإصدرات',
            duration: '1:20:00'
        },
        'react-intro': {
            youtubeId: 'w7ejDZ8SWv8',
            title: 'مقدمة إلى React',
            description: 'تعلم أساسيات مكتبة React الحديثة',
            duration: '55:00'
        },
        'react-components': {
            youtubeId: 'Y2hgEGPzTZY',
            title: 'مكونات React',
            description: 'كيفية إنشاء وإدارة المكونات',
            duration: '48:30'
        },
        'nodejs-intro': {
            youtubeId: 'TlB_eWDSMt4',
            title: 'مقدمة إلى Node.js',
            description: 'تعلم برمجة الخادم باستخدام JavaScript',
            duration: '50:30'
        },
        'portfolio-planning': {
            youtubeId: '0YFrGy_mzjY',
            title: 'تخطيط المشروع',
            description: 'تخطيط وتصميم الموقع الشخصي',
            duration: '35:20'
        }
    };
    
    return videoData[lessonId];
}

// ===== الحصول على دروس الكورس =====
function getCourseLessons(courseId) {
    const courseCard = document.getElementById(`course-${courseId}`);
    if (!courseCard) return [];
    
    const lessons = [];
    const lessonItems = courseCard.querySelectorAll('.lesson-item');
    
    lessonItems.forEach(item => {
        lessons.push({
            id: item.id.replace('lesson-', ''),
            title: item.querySelector('h4').textContent,
            description: item.querySelector('p').textContent,
            duration: item.querySelector('.lesson-duration').textContent.replace('🕒', '').trim(),
            completed: item.classList.contains('completed')
        });
    });
    
    return lessons;
}

// ===== الحصول على فهرس الدرس =====
function getLessonIndex(courseId, lessonId) {
    const lessons = getCourseLessons(courseId);
    return lessons.findIndex(lesson => lesson.id === lessonId);
}

// ===== فتح الملاحظات =====
function openNotes(lessonId) {
    showNotification('📝 ميزة الملاحظات قيد التطوير', 'info');
};

// ===== إعداد زر الـ Sidebar =====
function setupSidebarToggle() {
    const toggleBtn = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('mainSidebar');
    const mainContent = document.getElementById('mainContent');
    
    if (!toggleBtn || !sidebar) {
        console.error('❌ لم يتم العثور على عناصر الـ Sidebar');
        return;
    }
    
    // التحقق من الحالة المحفوظة
    const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    
    // تطبيق الحالة المحفوظة عند التحميل
    if (isCollapsed) {
        sidebar.classList.add('collapsed');
        toggleBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        toggleBtn.style.right = '25px';
        
        if (mainContent) {
            mainContent.style.marginRight = '0';
        }
    }
    
    // إضافة حدث النقر
    toggleBtn.addEventListener('click', function() {
        const isCollapsed = sidebar.classList.contains('collapsed');
        
        if (isCollapsed) {
            // إظهار الـ Sidebar
            sidebar.classList.remove('collapsed');
            toggleBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
            toggleBtn.style.right = '290px';
            
            if (mainContent) {
                mainContent.style.marginRight = '280px';
            }
        } else {
            // إخفاء الـ Sidebar
            sidebar.classList.add('collapsed');
            toggleBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
            toggleBtn.style.right = '25px';
            
            if (mainContent) {
                mainContent.style.marginRight = '0';
            }
        }
        
        // حفظ الحالة
        localStorage.setItem('sidebarCollapsed', !isCollapsed);
        
        // إعادة حساب دوائر التقدم
        setTimeout(() => {
            initProgressCircles();
        }, 300);
    });
}

// ===== إعداد التنقل =====
function setupRoadmapNavigation() {
    const mobileToggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.getElementById('mainSidebar');
    
    if (mobileToggle && sidebar) {
        mobileToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            mobileToggle.innerHTML = sidebar.classList.contains('open') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
        
        // إغلاق القائمة عند النقر على رابط
        document.querySelectorAll('.menu-link').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('open');
                    mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
                }
            });
        });
    }
}

// ===== طباعة الـ Roadmap =====
function printRoadmap() {
    showNotification('🖨️ جاري تحضير الطباعة...', 'info');
    setTimeout(() => {
        window.print();
    }, 500);
}

// ===== مشاركة الـ Roadmap =====
function shareRoadmap() {
    if (navigator.share) {
        navigator.share({
            title: 'خطة التعلم - مسار',
            text: 'اطلع على خطتي التعليمية الشخصية على منصة مسار',
            url: window.location.href,
        }).then(() => {
            console.log('✅ تمت المشاركة بنجاح');
        }).catch(error => {
            console.log('❌ تم إلغاء المشاركة:', error);
        });
    } else {
        // نسخ الرابط
        navigator.clipboard.writeText(window.location.href).then(() => {
            showNotification('🔗 تم نسخ رابط خطة التعلم', 'success');
        }).catch(err => {
            console.error('❌ فشل نسخ الرابط:', err);
            showNotification('❌ فشل نسخ الرابط', 'error');
        });
    }
}

// ===== الذهاب للبروفايل =====
function goToProfile() {
    showLoading('جاري تحميل صفحة البروفايل...');
    setTimeout(() => {
        window.location.href = 'profile.html';
    }, 500);
}

// ===== تسجيل الخروج =====
function logout() {
    if (confirm('هل تريد تسجيل الخروج؟')) {
        if (typeof StateManager !== 'undefined') {
            StateManager.logout();
        }
        showLoading('جاري تسجيل الخروج...');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }
}

// ===== عرض إشعار =====
function showNotification(message, type = 'info') {
    // إزالة أي إشعارات سابقة
    document.querySelectorAll('.notification').forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
        z-index: 9999;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        animation: slideIn 0.3s ease;
        min-width: 300px;
        max-width: 500px;
    `;
    
    document.body.appendChild(notification);
    
    // إضافة حدث الإغلاق
    notification.querySelector('.notification-close').addEventListener('click', function() {
        notification.remove();
    });
    
    // إزالة الإشعار تلقائياً بعد 5 ثواني
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// ===== عرض شاشة التحميل =====
function showLoading(message) {
    // إزالة أي شاشات تحميل سابقة
    document.querySelectorAll('.loading-overlay').forEach(el => el.remove());
    
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading-overlay';
    loadingDiv.innerHTML = `
        <div class="loading-content">
            <div class="spinner"></div>
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
    `;
    
    document.body.appendChild(loadingDiv);
    
    return loadingDiv;
}

// ===== إضافة أنماط الإشعارات =====
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
        flex: 1;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0.7;
        transition: opacity 0.3s ease;
    }
    
    .notification-close:hover {
        opacity: 1;
    }
    
    .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        border-top-color: white;
        animation: spin 1s linear infinite;
        margin-bottom: 20px;
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    
    .loading-content {
        text-align: center;
    }
    
    .loading-content p {
        margin-top: 15px;
        font-size: 1.1rem;
    }
    
    /* تحسينات للدروس والكورسات */
    .courses-container {
        display: none;
        padding: 20px;
        background: #f8fafc;
    }
    
    .courses-container.show {
        display: block;
    }
    
    .lessons-container {
        display: none;
        padding: 15px;
        background: #f1f5f9;
        border-radius: 0 0 10px 10px;
    }
    
    .lessons-container.show {
        display: block;
    }
    
    .roadmap-stage-card.active .stage-header {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
    }
    
    .course-card.active .course-header {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
    }
`;
document.head.appendChild(style);

console.log('✅ تم تحميل ملف roadmap.js بنجاح');

// جعل الدوال متاحة عالمياً لاستخدامها في HTML
window.toggleStage = toggleStage;
window.toggleCourse = toggleCourse;
window.startCourse = startCourse;
window.openVideo = openVideo;
window.toggleSidebar = () => {
    const toggleBtn = document.getElementById('sidebarToggle');
    if (toggleBtn) toggleBtn.click();
};
window.printRoadmap = printRoadmap;
window.shareRoadmap = shareRoadmap;
window.logout = logout;
window.goToProfile = goToProfile;
window.openNotes = openNotes;