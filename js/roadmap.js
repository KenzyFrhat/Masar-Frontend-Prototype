// roadmap.js - التحكم في صفحة خطة التعلم الكاملة

document.addEventListener('DOMContentLoaded', function() {
    initRoadmap();
    setupRoadmapNavigation();
    loadUserData();
});

// تهيئة صفحة الـ Roadmap
function initRoadmap() {
    // تحميل بيانات المستخدم
    loadUserData();
    
    // إعداد دوائر التقدم
    initProgressCircles();
    
    // إعداد الأحداث
    setupEventListeners();
    
    // فتح المرحلة الأولى تلقائياً
    setTimeout(() => {
        toggleStage('stage-1', true);
    }, 300);
}

// تحميل بيانات المستخدم
function loadUserData() {
    const userData = JSON.parse(localStorage.getItem('masarUserAnswers')) || 
                    JSON.parse(localStorage.getItem('userData'));
    
    if (userData && userData.name) {
        document.getElementById('roadmapUserName').textContent = `مرحباً، ${userData.name}`;
    }
    
    // تحديث إحصائيات المستخدم
    updateRoadmapStats();
}

// تحديث إحصائيات المستخدم في الـ Sidebar
function updateRoadmapStats() {
    const progressData = JSON.parse(localStorage.getItem('userProgress')) || {
        streakDays: 3,
        totalHours: 12
    };
    
    document.getElementById('roadmapStreakDays').textContent = progressData.streakDays;
    document.getElementById('roadmapTotalHours').textContent = progressData.totalHours;
}

// إعداد دوائر التقدم
function initProgressCircles() {
    document.querySelectorAll('.progress-circle').forEach(circle => {
        const progress = parseInt(circle.getAttribute('data-progress'));
        const circleElement = circle.querySelector('.progress-bar');
        const circumference = 2 * Math.PI * 27;
        const offset = circumference - (progress / 100) * circumference;
        
        circleElement.style.strokeDasharray = circumference;
        circleElement.style.strokeDashoffset = offset;
    });
}

// إعداد الأحداث
function setupEventListeners() {
    // البحث في الـ Roadmap
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'ابحث في الدروس...';
    searchInput.className = 'roadmap-search';
    searchInput.style.cssText = `
        margin: 20px auto;
        padding: 12px 20px;
        width: 90%;
        max-width: 500px;
        display: block;
        border: 2px solid #e2e8f0;
        border-radius: 25px;
        font-family: 'Tajawal', sans-serif;
        font-size: 1rem;
    `;
    
    const roadmapSection = document.querySelector('.roadmap-stages-section');
    if (roadmapSection) {
        roadmapSection.parentNode.insertBefore(searchInput, roadmapSection);
        
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            
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
                        const stageId = stage.id;
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
                    const stageId = stageCard.id;
                    const courseId = course.id;
                    
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
                    const stageId = stageCard.id;
                    const courseId = courseCard.id;
                    
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
        });
    }
}

// تبديل فتح/إغلاق المرحلة
window.toggleStage = function(stageId, forceOpen = false) {
    const stageCard = document.getElementById(stageId);
    const coursesContainer = document.getElementById(`courses-${stageId}`);
    
    if (!stageCard || !coursesContainer) return;
    
    const isActive = stageCard.classList.contains('active');
    
    if (forceOpen || !isActive) {
        // إغلاق جميع المراحل الأخرى
        document.querySelectorAll('.roadmap-stage-card').forEach(card => {
            card.classList.remove('active');
            const container = document.getElementById(`courses-${card.id}`);
            if (container) {
                container.style.display = 'none';
            }
        });
        
        // فتح هذه المرحلة
        stageCard.classList.add('active');
        coursesContainer.style.display = 'block';
        
        // تحديث أيقونة السهم
        const arrowIcon = stageCard.querySelector('.stage-badge i');
        if (arrowIcon) {
            arrowIcon.className = 'fas fa-chevron-up';
        }
    } else {
        stageCard.classList.remove('active');
        coursesContainer.style.display = 'none';
        
        // تحديث أيقونة السهم
        const arrowIcon = stageCard.querySelector('.stage-badge i');
        if (arrowIcon) {
            arrowIcon.className = 'fas fa-chevron-down';
        }
    }
};

// تبديل فتح/إغلاق الكورس
window.toggleCourse = function(stageId, courseId) {
    const courseCard = document.getElementById(courseId);
    const lessonsContainer = document.getElementById(`lessons-${courseId}`);
    
    if (!courseCard || !lessonsContainer) return;
    
    const isActive = courseCard.classList.contains('active');
    
    if (!isActive) {
        // إغلاق جميع الكورسات الأخرى في نفس المرحلة
        const stageCard = document.getElementById(stageId);
        const allCourses = stageCard.querySelectorAll('.course-card');
        allCourses.forEach(course => {
            course.classList.remove('active');
            const container = document.getElementById(`lessons-${course.id}`);
            if (container) {
                container.style.display = 'none';
            }
        });
        
        // فتح هذا الكورس
        courseCard.classList.add('active');
        lessonsContainer.style.display = 'block';
        
        // تحديث أيقونة السهم
        const arrowIcon = courseCard.querySelector('.course-toggle');
        if (arrowIcon) {
            arrowIcon.className = 'fas fa-chevron-up';
        }
    } else {
        courseCard.classList.remove('active');
        lessonsContainer.style.display = 'none';
        
        // تحديث أيقونة السهم
        const arrowIcon = courseCard.querySelector('.course-toggle');
        if (arrowIcon) {
            arrowIcon.className = 'fas fa-chevron-down';
        }
    }
};

// بدء كورس
window.startCourse = function(stageId, courseId) {
    // افتح الكورس أولاً
    toggleCourse(stageId, courseId);
    
    // افتح أول درس غير مكتمل
    const courseCard = document.getElementById(courseId);
    const firstPendingLesson = courseCard.querySelector('.lesson-item:not(.completed)');
    
    if (firstPendingLesson) {
        const lessonNumber = firstPendingLesson.querySelector('.lesson-number').textContent;
        alert(`🎯 سنبدأ من الدرس ${lessonNumber} في هذا الكورس`);
        
        // تمرير للدرس
        firstPendingLesson.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    } else {
        alert('🎉 لقد أكملت جميع دروس هذا الكورس!');
    }
};

// فتح فيديو
window.openVideo = function(stageId, courseId, lessonId) {
    // بيانات الفيديوهات الحقيقية
    const videoData = {
        'html-basics': {
            youtubeId: 'qz0aGYrrlhU',
            title: 'مقدمة إلى HTML',
            description: 'تعلم أساسيات لغة HTML في 30 دقيقة'
        },
        'css-fundamentals': {
            youtubeId: '1PnVor36_40',
            title: 'أساسيات CSS',
            description: 'تصميم صفحات الويب باستخدام CSS'
        },
        'responsive-design': {
            youtubeId: 'srvUrASNj0s',
            title: 'التصميم المتجاوب',
            description: 'جعل المواقع تعمل على جميع الأجهزة'
        },
        'js-intro': {
            youtubeId: 'W6NZfCO5SIk',
            title: 'مقدمة JavaScript',
            description: 'تعلم البرمجة بلغة JavaScript'
        },
        'js-functions': {
            youtubeId: 'Mus_vwhTCq0',
            title: 'الدوال في JavaScript',
            description: 'كيفية كتابة واستخدام الدوال'
        },
        'js-arrays': {
            youtubeId: '7W4pQQ20nJg',
            title: 'المصفوفات في JavaScript',
            description: 'كيفية التعامل مع المصفوفات'
        },
        'git-basics': {
            youtubeId: 'RGOj5yH7evk',
            title: 'مقدمة إلى Git',
            description: 'أساسيات نظام التحكم في الإصدارات'
        },
        'react-intro': {
            youtubeId: 'w7ejDZ8SWv8',
            title: 'مقدمة إلى React',
            description: 'تعلم أساسيات مكتبة React'
        },
        'react-components': {
            youtubeId: 'Y2hgEGPzTZY',
            title: 'مكونات React',
            description: 'كيفية إنشاء وإدارة المكونات'
        },
        'nodejs-intro': {
            youtubeId: 'TlB_eWDSMt4',
            title: 'مقدمة إلى Node.js',
            description: 'تعلم برمجة الخادم باستخدام JavaScript'
        },
        'portfolio-planning': {
            youtubeId: '0YFrGy_mzjY',
            title: 'تخطيط المشروع',
            description: 'تخطيط وتصميم الموقع الشخصي'
        }
    };
    
    const video = videoData[lessonId];
    if (!video) {
        console.error('❌ لم يتم العثور على بيانات الفيديو:', lessonId);
        return;
    }
    
    // جمع بيانات المرحلة والكورس
    const stageCard = document.getElementById(stageId);
    const courseCard = document.getElementById(courseId);
    
    const sessionData = {
        stage: {
            id: stageId,
            title: stageCard.querySelector('.stage-title h2')?.textContent || '',
            number: stageId.replace('stage-', '')
        },
        course: {
            id: courseId,
            title: courseCard.querySelector('.course-info h3')?.textContent || '',
            description: courseCard.querySelector('.course-info p')?.textContent || '',
            icon: courseCard.querySelector('.course-icon i')?.className || ''
        },
        lesson: {
            id: lessonId,
            title: video.title,
            description: video.description,
            youtubeId: video.youtubeId,
            duration: '30:00' // يمكن إضافة مدة حقيقية
        },
        courseLessons: [
            {
                id: lessonId,
                title: video.title,
                description: video.description,
                youtubeId: video.youtubeId,
                duration: '30:00'
            }
        ],
        currentLessonIndex: 0
    };
    
    console.log('💾 حفظ بيانات الجلسة:', sessionData);
    localStorage.setItem('currentVideoSession', JSON.stringify(sessionData));
    
    // الانتقال إلى مشغل الفيديو
    setTimeout(() => {
        console.log('🔄 الانتقال إلى course-player.html');
        window.location.href = 'course-player.html';
    }, 300);
};

// طباعة الـ Roadmap
window.printRoadmap = function() {
    window.print();
};

// مشاركة الـ Roadmap
window.shareRoadmap = function() {
    if (navigator.share) {
        navigator.share({
            title: 'خطة التعلم - مسار',
            text: 'اطلع على خطتي التعليمية على منصة مسار',
            url: window.location.href,
        });
    } else {
        // نسخ الرابط
        navigator.clipboard.writeText(window.location.href).then(() => {
            alert('🔗 تم نسخ رابط خطة التعلم');
        });
    }
};

// تسجيل الخروج
window.logout = function() {
    if (confirm('هل تريد تسجيل الخروج؟')) {
        // إعادة التوجيه للصفحة الرئيسية
        window.location.href = 'index.html';
    }
};

// إعداد التنقل
function setupRoadmapNavigation() {
    const mobileToggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (mobileToggle && sidebar) {
        mobileToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            mobileToggle.innerHTML = sidebar.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
        
        // إغلاق القائمة عند النقر على رابط
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