document.addEventListener('DOMContentLoaded', function() {
    let sessionData = null;
    let currentLessonIndex = 0;
    let notes = JSON.parse(localStorage.getItem('masarNotes')) || {};
    let autoSaveInterval;
    let currentVideoData = {};
    let player = null;

    // تهيئة المشغل
    function initPlayer() {
        // تحميل بيانات الجلسة
        sessionData = JSON.parse(localStorage.getItem('currentVideoSession'));
        
        // إذا لم توجد بيانات جلسة، استخدم البيانات الافتراضية من الصفحة
        if (!sessionData) {
            sessionData = {
                course: {
                    title: "HTML & CSS للمبتدئين",
                    id: "course-html-css"
                },
                stage: {
                    title: "المرحلة 1: أساسيات البرمجة",
                    id: "stage-1"
                },
                courseLessons: [
                    {
                        id: "lesson-html-basics",
                        title: "مقدمة إلى HTML - أساسيات بناء صفحات الويب",
                        description: "في هذا الدرس سنتعرف على أساسيات لغة HTML، كيفية بناء هيكل صفحة الويب، واستخدام العناصر الأساسية مثل العناوين، الفقرات، الروابط، والصور. هذا الدرس هو البوابة الأولى لدخول عالم تطوير الويب.",
                        duration: "30:15",
                        youtubeId: "qz0aGYrrlhU",
                        level: "مبتدئ",
                        completed: true,
                        views: 1250,
                        createdAt: "2024-01-15T10:30:00Z",
                        summary: [
                            "فهم هيكل صفحة HTML الأساسي",
                            "تعلم استخدام العناوين h1 إلى h6",
                            "إضافة النصوص والفقرات باستخدام p",
                            "إنشاء الروابط مع علامة a",
                            "إضافة الصور باستخدام img",
                            "فهم الفرق بين العناصر المغلقة والمفتوحة"
                        ],
                        resources: [
                            {
                                type: "website",
                                title: "دليل HTML على MDN",
                                description: "المرجع الرسمي والشامل للغة HTML من موزيلا",
                                url: "https://developer.mozilla.org/ar/docs/Web/HTML"
                            },
                            {
                                type: "website",
                                title: "تعلم HTML على W3Schools",
                                description: "دروس تفاعلية وأمثلة عملية مع محرر مباشر",
                                url: "https://www.w3schools.com/html/"
                            }
                        ]
                    },
                    {
                        id: "lesson-css-basics",
                        title: "أساسيات CSS - تنسيق صفحات الويب",
                        description: "تعلم كيفية تنسيق وتصميم صفحات الويب باستخدام CSS، تغيير الألوان، الخطوط، الحواف، والخلفيات.",
                        duration: "45:30",
                        youtubeId: "dD2EISBDjWM",
                        level: "مبتدئ",
                        completed: false,
                        views: 850,
                        createdAt: "2024-01-20T14:00:00Z",
                        summary: [
                            "كيفية إضافة CSS إلى صفحات HTML",
                            "تحديد العناصر باستخدام class و id",
                            "تغيير الألوان والخطوط",
                            "إضافة الحواف والظلال",
                            "ضبط المسافات والحواف"
                        ]
                    },
                    {
                        id: "lesson-responsive-design",
                        title: "التصميم المتجاوب - مواقع تعمل على جميع الأجهزة",
                        description: "تعلم كيفية جعل مواقع الويب متجاوبة تعمل على جميع أحجام الشاشات من الهواتف إلى أجهزة الكمبيوتر المكتبية.",
                        duration: "42:30",
                        youtubeId: "y3UH2gAhwPI",
                        level: "متوسط",
                        completed: false,
                        views: 620,
                        createdAt: "2024-01-25T09:15:00Z"
                    },
                    {
                        id: "lesson-html-forms",
                        title: "نماذج HTML - تفاعل المستخدم مع الموقع",
                        description: "تعلم كيفية إنشاء نماذج تفاعلية لجمع بيانات المستخدمين.",
                        duration: "35:20",
                        youtubeId: "abc123def",
                        level: "مبتدئ",
                        completed: false,
                        views: 320,
                        createdAt: "2024-02-01T11:45:00Z"
                    },
                    {
                        id: "lesson-project",
                        title: "مشروع عملي - بناء موقع ويب كامل",
                        description: "تطبيق عملي لما تعلمته في بناء موقع ويب متكامل.",
                        duration: "25:00",
                        youtubeId: "xyz789ghi",
                        level: "متوسط",
                        completed: false,
                        views: 150,
                        createdAt: "2024-02-05T16:30:00Z"
                    }
                ],
                currentLessonIndex: 0
            };
        }

        // تحديث currentLessonIndex من البيانات المحفوظة
        currentLessonIndex = sessionData.currentLessonIndex || 0;

        loadUserData();
        loadCourseData();
        loadLessonsList();
        loadVideo(currentLessonIndex);
        setupEventListeners();
        calculateCourseStats();
        setupKeyboardShortcuts();
        initAutoSave();
        adjustVideoHeight();
    }

    // تحميل بيانات المستخدم
    function loadUserData() {
        const userData = JSON.parse(localStorage.getItem('userData')) || {
            name: "محمد",
            level: "مبتدئ"
        };
        
        // تحديث الاسم في الـ Sidebar
        const userNameElement = document.getElementById('playerUserName');
        if (userNameElement && userData.name) {
            userNameElement.textContent = `مرحباً، ${userData.name}`;
        }
        
        // تحديث المستوى
        const userLevelElement = document.querySelector('.user-level');
        if (userLevelElement) {
            userLevelElement.textContent = userData.level;
        }
        
        // تحديث إحصائيات المستخدم
        updatePlayerStats();
    }

    // تحديث إحصائيات المستخدم في الـ Sidebar
    function updatePlayerStats() {
        const progressData = JSON.parse(localStorage.getItem('userProgress')) || {
            streakDays: 3,
            completedVideos: 8,
            completedCourses: 2,
            totalHours: 12
        };
        
        // تحديث قيم الـ Sidebar
        const streakElement = document.getElementById('playerStreakDays');
        const videosElement = document.getElementById('playerCompletedVideos');
        
        if (streakElement) streakElement.textContent = progressData.streakDays;
        if (videosElement) videosElement.textContent = progressData.completedVideos;
        
        // تحديث إحصائيات النشاط في الداشبورد (إذا كان موجوداً)
        if (window.updateDashboardStats) {
            window.updateDashboardStats(progressData);
        }
    }

    // تحميل بيانات الكورس
    function loadCourseData() {
        const courseTitleElement = document.getElementById('coursePlayerTitle');
        const currentStageElement = document.getElementById('currentStage');
        const currentCourseElement = document.getElementById('currentCourse');
        const totalDurationElement = document.getElementById('totalCourseDuration');
        
        if (courseTitleElement) {
            courseTitleElement.textContent = sessionData.course.title;
        }
        
        if (currentStageElement) {
            currentStageElement.textContent = sessionData.stage.title;
        }
        
        if (currentCourseElement) {
            currentCourseElement.textContent = sessionData.course.title;
        }
        
        // حساب المدة الإجمالية للكورس
        if (totalDurationElement) {
            const totalDuration = calculateTotalDuration(sessionData.courseLessons);
            totalDurationElement.textContent = totalDuration;
        }
    }

    // حساب المدة الإجمالية
    function calculateTotalDuration(lessons) {
        let totalSeconds = 0;
        lessons.forEach(lesson => {
            const [min, sec] = (lesson.duration || "0:00").split(':').map(Number);
            totalSeconds += (min * 60) + (sec || 0);
        });
        
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        
        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')} ساعة`;
        } else {
            return `${minutes} دقيقة`;
        }
    }

    // تحميل قائمة الدروس
    function loadLessonsList() {
        const lessonsList = document.getElementById('lessonsList');
        const lessons = sessionData.courseLessons;
        
        if (!lessonsList || !lessons) return;
        
        let lessonsHTML = '';
        
        lessons.forEach((lesson, index) => {
            const isActive = index === currentLessonIndex;
            const isCompleted = lesson.completed;
            
            lessonsHTML += `
                <div class="lesson-item ${isActive ? 'current' : ''} ${isCompleted ? 'completed' : ''}" 
                     data-index="${index}" 
                     data-video-id="${lesson.youtubeId}" 
                     data-lesson="${index + 1}">
                    <div class="lesson-order">${index + 1}</div>
                    <div class="lesson-info">
                        <h4>${lesson.title}</h4>
                        <div class="lesson-meta">
                            <span><i class="fas fa-clock"></i> ${lesson.duration}</span>
                            <span class="status ${isCompleted ? 'completed' : 'pending'}">
                                ${isActive ? 'جاري المشاهدة' : (isCompleted ? 'مكتمل' : 'قيد الانتظار')}
                            </span>
                        </div>
                    </div>
                    <button class="play-lesson">
                        <i class="fas fa-play"></i>
                    </button>
                </div>
            `;
        });
        
        lessonsList.innerHTML = lessonsHTML;
        
        // إضافة مستمعي الأحداث لأزرار التشغيل
        lessonsList.querySelectorAll('.play-lesson').forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const lessonItem = this.closest('.lesson-item');
                const index = parseInt(lessonItem.getAttribute('data-index'));
                switchToLesson(index);
            });
        });
        
        // إضافة مستمعي الأحداث لعناصر الدرس
        lessonsList.querySelectorAll('.lesson-item').forEach(item => {
            item.addEventListener('click', function(e) {
                if (!e.target.closest('.play-lesson')) {
                    const index = parseInt(this.getAttribute('data-index'));
                    switchToLesson(index);
                }
            });
        });
        
        // تمرير للدرس الحالي
        scrollToCurrentLesson();
    }

    // تمرير للدرس الحالي
    function scrollToCurrentLesson() {
        setTimeout(() => {
            const activeLesson = document.querySelector('.lesson-item.current');
            if (activeLesson) {
                activeLesson.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        }, 300);
    }

    // تحميل فيديو معين
    function loadVideo(index) {
        const lessons = sessionData.courseLessons;
        const lesson = lessons[index];
        
        if (!lesson) {
            showNotification('❌ لم يتم العثور على الفيديو', 'warning');
            return;
        }
        
        currentLessonIndex = index;
        currentVideoData = lesson;
        
        // إظهار مؤشر التحميل
        showLoading(true);
        
        // تحديث الواجهة
        updateVideoInfo(lesson);
        
        // تحميل فيديو YouTube
        loadYouTubeVideo(lesson.youtubeId);
        
        // تحديث قائمة الدروس
        updateLessonsList();
        
        // تحديث التقدم
        updateProgress();
        
        // تحميل الملاحظات
        loadLessonNotes(lesson.id);
        
        // تحديث عداد المشاهدات
        updateViewCount(lesson);
        
        // تحميل الموارد الإضافية
        loadLessonResources(lesson);
        
        // إخفاء مؤشر التحميل بعد تأخير قصير
        setTimeout(() => {
            showLoading(false);
        }, 1500);
        
        // حفظ الحالة الحالية
        saveCurrentState();
        
        // تحديث title الصفحة
        document.title = `${lesson.title} - MASAR`;
    }

    // تبديل إلى درس معين
    function switchToLesson(index) {
        if (index >= 0 && index < sessionData.courseLessons.length) {
            loadVideo(index);
            showNotification('📹 جاري تحميل الدرس...', 'info');
        }
    }

    // تحديث معلومات الفيديو
    function updateVideoInfo(lesson) {
        // تحديث العنوان
        const videoTitleElement = document.getElementById('videoTitle');
        if (videoTitleElement) {
            videoTitleElement.textContent = lesson.title;
        }
        
        // تحديث الوصف
        const descriptionElement = document.getElementById('videoDescription');
        if (descriptionElement) {
            descriptionElement.textContent = lesson.description || 'لا يوجد وصف متاح لهذا الدرس.';
        }
        
        // تحديث المدة
        const durationElement = document.getElementById('videoDuration');
        if (durationElement) {
            const durationSpan = durationElement.querySelector('span');
            if (durationSpan) {
                durationSpan.textContent = lesson.duration || '--:--';
            }
        }
        
        // تحديث المستوى
        const levelElement = document.getElementById('videoLevel');
        if (levelElement) {
            const levelSpan = levelElement.querySelector('span');
            if (levelSpan) {
                levelSpan.textContent = lesson.level || 'مبتدئ';
            }
        }
        
        // تحديث مستوى الدرس
        const lessonLevelElement = document.getElementById('lessonLevel');
        if (lessonLevelElement) {
            lessonLevelElement.textContent = lesson.level || 'مبتدئ';
        }
        
        // تحديث حالة الفيديو
        const statusElement = document.getElementById('videoStatus');
        if (statusElement) {
            const statusSpan = statusElement.querySelector('span');
            if (statusSpan) {
                statusSpan.textContent = lesson.completed ? 'مكتمل' : 'غير مكتمل';
            }
        }
        
        // تحديث التاريخ
        const lessonDateElement = document.getElementById('lessonDate');
        if (lessonDateElement && lesson.createdAt) {
            lessonDateElement.textContent = formatDate(lesson.createdAt);
        }
        
        // تحديث عداد المشاهدات
        const viewCountElement = document.getElementById('viewCount');
        if (viewCountElement) {
            viewCountElement.textContent = lesson.views || 0;
        }
        
        // تحديث الملخص إذا كان متاحاً
        const summaryElement = document.getElementById('videoSummary');
        if (summaryElement) {
            summaryElement.innerHTML = generateSummaryHTML(lesson.summary);
        }
    }

    // تنسيق التاريخ
    function formatDate(dateString) {
        try {
            const date = new Date(dateString);
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return date.toLocaleDateString('ar-SA', options);
        } catch (e) {
            return "يناير 2024";
        }
    }

    // توليد HTML للملخص
    function generateSummaryHTML(summary) {
        if (Array.isArray(summary)) {
            let html = '<h5>النقاط الرئيسية:</h5><ul class="summary-list">';
            summary.forEach(item => {
                html += `<li><i class="fas fa-check-circle"></i> ${item}</li>`;
            });
            html += '</ul>';
            return html;
        } else if (typeof summary === 'string') {
            return `<div class="summary-content">${summary}</div>`;
        }
        return '<p>لا يوجد ملخص متاح لهذا الدرس</p>';
    }

    // تحميل فيديو YouTube
    function loadYouTubeVideo(videoId) {
        const playerElement = document.getElementById('youtubePlayer');
        
        if (!playerElement) return;
        
        // إضافة فئة loaded لإزالة الخلفية
        playerElement.classList.add('loaded');
        
        // بناء رابط YouTube
        let youtubeUrl = `https://www.youtube.com/embed/${videoId}?`;
        youtubeUrl += `rel=0`;
        youtubeUrl += `&modestbranding=1`;
        youtubeUrl += `&playsinline=1`;
        youtubeUrl += `&controls=1`;
        youtubeUrl += `&showinfo=0`;
        youtubeUrl += `&cc_load_policy=1`;
        youtubeUrl += `&iv_load_policy=3`;
        
        playerElement.src = youtubeUrl;
    }

    // إظهار/إخفاء مؤشر التحميل
    function showLoading(show) {
        const loadingElement = document.getElementById('videoLoading');
        if (loadingElement) {
            loadingElement.style.display = show ? 'flex' : 'none';
        }
    }

    // الفيديو السابق
    window.previousVideo = function() {
        if (currentLessonIndex > 0) {
            switchToLesson(currentLessonIndex - 1);
            showNotification('⏮️ الانتقال إلى الدرس السابق', 'info');
        } else {
            showNotification('⏮️ هذا أول درس في الكورس', 'info');
        }
    };

    // الفيديو التالي
    window.nextVideo = function() {
        const lessons = sessionData.courseLessons;
        if (currentLessonIndex < lessons.length - 1) {
            switchToLesson(currentLessonIndex + 1);
            showNotification('⏭️ الانتقال إلى الدرس التالي', 'info');
        } else {
            showNotification('🎉 وصلت لنهاية الكورس! مبروك!', 'success');
            
            // التحقق إذا كان جميع الدروس مكتملة
            const allCompleted = lessons.every(lesson => lesson.completed);
            if (allCompleted) {
                setTimeout(() => {
                    showNotification('🏆 مبروك! لقد أكملت هذا الكورس بنجاح!', 'success');
                    markCourseComplete(true);
                }, 1000);
            }
        }
    };

    // تحديث قائمة الدروس
    function updateLessonsList() {
        const lessons = sessionData.courseLessons;
        
        document.querySelectorAll('.lesson-item').forEach((item, index) => {
            item.classList.remove('current', 'completed');
            
            if (index === currentLessonIndex) {
                item.classList.add('current');
            }
            
            if (lessons[index].completed) {
                item.classList.add('completed');
            }
        });
        
        scrollToCurrentLesson();
    }

    // تحديث التقدم
    function updateProgress() {
        const lessons = sessionData.courseLessons;
        const completedLessons = lessons.filter(lesson => lesson.completed).length;
        const progress = Math.round((completedLessons / lessons.length) * 100);
        
        // تحديث شريط التقدم
        const progressFill = document.getElementById('courseProgressFill');
        const progressText = document.getElementById('courseProgressText');
        
        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }
        
        if (progressText) {
            progressText.textContent = `${progress}%`;
        }
    }

    // حساب إحصائيات الكورس
    function calculateCourseStats() {
        const lessons = sessionData.courseLessons;
        
        // إجمالي الدروس
        const totalLessonsElement = document.getElementById('totalLessons');
        if (totalLessonsElement) {
            totalLessonsElement.textContent = lessons.length;
        }
        
        // الدروس المكتملة
        const completedLessons = lessons.filter(lesson => lesson.completed).length;
        const completedLessonsElement = document.getElementById('completedLessons');
        if (completedLessonsElement) {
            completedLessonsElement.textContent = completedLessons;
        }
        
        // إجمالي المدة
        let totalSeconds = 0;
        lessons.forEach(lesson => {
            const [min, sec] = (lesson.duration || "0:00").split(':').map(Number);
            totalSeconds += (min * 60) + (sec || 0);
        });
        
        const totalHours = Math.floor(totalSeconds / 3600);
        const totalMinutes = Math.floor((totalSeconds % 3600) / 60);
        const totalDurationElement = document.getElementById('totalDuration');
        
        if (totalDurationElement) {
            totalDurationElement.textContent = `${totalHours}:${totalMinutes.toString().padStart(2, '0')}`;
        }
    }

    // تحديث عداد المشاهدات
    function updateViewCount(lesson) {
        if (!lesson.views) lesson.views = 0;
        lesson.views++;
        
        // تحديث العرض
        const viewCountElement = document.getElementById('viewCount');
        if (viewCountElement) {
            viewCountElement.textContent = lesson.views;
        }
        
        // وضع علامة كمشاهدة إذا لم يكن مكتملاً
        if (!lesson.completed) {
            markLessonComplete(lesson);
        }
        
        // حفظ التحديثات
        saveCurrentState();
    }

    // وضع علامة على الدرس كمكتمل
    function markLessonComplete(lesson) {
        lesson.completed = true;
        
        // تحديث التقدم
        updateProgress();
        updateLessonsList();
        
        // تحديث الإحصائيات
        calculateCourseStats();
        
        // تحديث إحصائيات المستخدم
        updateUserStats();
        
        // إشعار النجاح
        showNotification('✅ تم وضع علامة على الفيديو كمكتمل!', 'success');
    }

    // تحديث إحصائيات المستخدم
    function updateUserStats() {
        const userProgress = JSON.parse(localStorage.getItem('userProgress')) || {
            streakDays: 3,
            completedVideos: 8,
            completedCourses: 2,
            totalHours: 12
        };
        
        // زيادة عدد الفيديوهات المكتملة
        userProgress.completedVideos = (userProgress.completedVideos || 0) + 1;
        
        // زيادة عدد الساعات (تقديري)
        userProgress.totalHours = (userProgress.totalHours || 0) + 0.5;
        
        // تحديث streak
        const today = new Date().toDateString();
        const lastStudyDate = localStorage.getItem('lastStudyDate');
        
        if (lastStudyDate !== today) {
            userProgress.streakDays = (userProgress.streakDays || 0) + 1;
            localStorage.setItem('lastStudyDate', today);
        }
        
        // حفظ التحديثات
        localStorage.setItem('userProgress', JSON.stringify(userProgress));
        
        // تحديث الـ Sidebar
        updatePlayerStats();
    }

    // تحميل ملاحظات الدرس
    function loadLessonNotes(lessonId) {
        const lessonNotes = notes[lessonId] || [];
        const notesHistory = document.getElementById('notesHistory');
        const notesCount = document.getElementById('notesCount');
        
        // تحديث عدد الملاحظات
        if (notesCount) {
            notesCount.textContent = lessonNotes.length;
        }
        
        // تحديث قائمة الملاحظات
        if (notesHistory) {
            let notesHTML = '';
            
            if (lessonNotes.length > 0) {
                lessonNotes.forEach((note, index) => {
                    notesHTML += `
                        <div class="note-item">
                            <div class="note-header">
                                <span class="note-date">${note.date}</span>
                                <button class="note-delete" onclick="deleteNote('${lessonId}', ${index})">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                            <p class="note-content">${note.text}</p>
                        </div>
                    `;
                });
            } else {
                notesHTML = `
                    <div class="empty-notes">
                        <i class="fas fa-sticky-note"></i>
                        <p>لا توجد ملاحظات سابقة</p>
                    </div>
                `;
            }
            
            notesHistory.innerHTML = notesHTML;
        }
        
        // مسح حقل الملاحظات
        const userNotesElement = document.getElementById('userNotes');
        if (userNotesElement) {
            userNotesElement.value = '';
        }
        
        // تحديث عدد الحروف
        updateCharCount();
    }

    // تحديث عدد الحروف
    function updateCharCount() {
        const textarea = document.getElementById('userNotes');
        const charCount = document.getElementById('charCount');
        
        if (textarea && charCount) {
            const length = textarea.value.length;
            charCount.textContent = `${length} حرف`;
        }
    }

    // حفظ الملاحظات
    window.saveNotes = function() {
        const notesText = document.getElementById('userNotes').value.trim();
        
        if (!notesText) {
            showNotification('⚠️ يرجى كتابة ملاحظة أولاً', 'warning');
            return;
        }
        
        const lessonId = currentVideoData.id || `lesson-${currentLessonIndex}`;
        
        if (!notes[lessonId]) {
            notes[lessonId] = [];
        }
        
        const newNote = {
            text: notesText,
            date: new Date().toLocaleString('ar-SA', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }),
            timestamp: new Date().toISOString()
        };
        
        // إضافة الملاحظة في البداية
        notes[lessonId].unshift(newNote);
        
        // حفظ في localStorage
        localStorage.setItem('masarNotes', JSON.stringify(notes));
        
        // تحديث العرض
        loadLessonNotes(lessonId);
        
        // إظهار رسالة نجاح
        showNotification('💾 تم حفظ ملاحظاتك بنجاح', 'success');
    };

    // حذف ملاحظة
    window.deleteNote = function(lessonId, noteIndex) {
        if (confirm('هل تريد حذف هذه الملاحظة؟')) {
            notes[lessonId].splice(noteIndex, 1);
            localStorage.setItem('masarNotes', JSON.stringify(notes));
            loadLessonNotes(lessonId);
            showNotification('🗑️ تم حذف الملاحظة', 'info');
        }
    };

    // تحميل الموارد الإضافية
    function loadLessonResources(lesson) {
        const resourcesList = document.getElementById('resourcesList');
        
        if (!resourcesList) return;
        
        if (lesson.resources && lesson.resources.length > 0) {
            let resourcesHTML = '';
            
            lesson.resources.forEach((resource) => {
                resourcesHTML += `
                    <a href="${resource.url}" class="resource-item" target="_blank">
                        <div class="resource-icon">
                            <i class="${getResourceIcon(resource.type)}"></i>
                        </div>
                        <div class="resource-content">
                            <h5>${resource.title}</h5>
                            <p>${resource.description || ''}</p>
                            <span class="resource-type">${resource.type || 'رابط'}</span>
                        </div>
                    </a>
                `;
            });
            
            resourcesList.innerHTML = resourcesHTML;
        } else {
            resourcesList.innerHTML = `
                <div class="empty-resources">
                    <i class="fas fa-link"></i>
                    <p>لا توجد موارد إضافية لهذا الدرس</p>
                </div>
            `;
        }
    }

    // الحصول على أيقونة المورد
    function getResourceIcon(type) {
        const icons = {
            'article': 'fas fa-file-alt',
            'video': 'fas fa-video',
            'book': 'fas fa-book',
            'website': 'fas fa-globe',
            'github': 'fab fa-github',
            'document': 'fas fa-file-pdf',
            'exercise': 'fas fa-dumbbell',
            'quiz': 'fas fa-question-circle'
        };
        
        return icons[type] || 'fas fa-link';
    }

    // حفظ الحالة الحالية
    function saveCurrentState() {
        if (sessionData) {
            sessionData.currentLessonIndex = currentLessonIndex;
            localStorage.setItem('currentVideoSession', JSON.stringify(sessionData));
        }
    }

    // تهيئة الحفظ التلقائي
    function initAutoSave() {
        // حذف أي فاصل زمني سابق
        if (autoSaveInterval) {
            clearInterval(autoSaveInterval);
        }
        
        // حفظ تلقائي كل 30 ثانية
        autoSaveInterval = setInterval(() => {
            saveCurrentState();
        }, 30000);
    }

    // إعداد الأحداث
    function setupEventListeners() {
        // تبويبات المحتوى
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                
                // إزالة النشاط من جميع الأزرار
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                // إضافة النشاط للزر المضغوط
                this.classList.add('active');
                
                // إخفاء جميع المحتويات
                document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
                // إظهار المحتوى المطلوب
                const targetPane = document.getElementById(tabId);
                if (targetPane) {
                    targetPane.classList.add('active');
                }
            });
        });

        // تحديث حجم الفيديو عند تغيير حجم النافذة
        window.addEventListener('resize', adjustVideoHeight);
        
        // مساعدة الاختصارات
        document.addEventListener('keydown', (e) => {
            if (e.key === '?') {
                toggleShortcutsHelp();
            }
        });

        // حفظ عند مغادرة الصفحة
        window.addEventListener('beforeunload', function() {
            saveCurrentState();
            if (autoSaveInterval) {
                clearInterval(autoSaveInterval);
            }
        });
        
        // فتح/إغلاق القائمة على الموبايل
        const mobileToggle = document.getElementById('mobileMenuToggle');
        const sidebar = document.querySelector('.sidebar');
        
        if (mobileToggle && sidebar) {
            mobileToggle.addEventListener('click', () => {
                sidebar.classList.toggle('open');
            });
        }
        
        // مستمعي الأحداث لأزرار التحكم
        document.getElementById('prevBtn')?.addEventListener('click', previousVideo);
        document.getElementById('nextBtn')?.addEventListener('click', nextVideo);
        document.getElementById('copyDescBtn')?.addEventListener('click', copyDescription);
        document.getElementById('downloadBtn')?.addEventListener('click', downloadSummary);
        document.getElementById('saveNotesBtn')?.addEventListener('click', saveNotes);
        document.getElementById('markCompleteBtn')?.addEventListener('click', () => markCourseComplete(false));
        document.getElementById('logoutBtn')?.addEventListener('click', logout);
        document.getElementById('shareBtn')?.addEventListener('click', shareCourse);
        document.getElementById('fullscreenBtn')?.addEventListener('click', toggleFullscreen);
        document.getElementById('closeHelpBtn')?.addEventListener('click', toggleShortcutsHelp);
        
        // أدوات تنسيق النص
        document.querySelectorAll('.tool-btn[data-format]').forEach(btn => {
            btn.addEventListener('click', function() {
                const format = this.getAttribute('data-format');
                formatText(format);
            });
        });
        
        document.getElementById('addBulletBtn')?.addEventListener('click', addBulletPoint);
        
        // تحديث عدد الأحرف عند الكتابة
        const userNotesElement = document.getElementById('userNotes');
        if (userNotesElement) {
            userNotesElement.addEventListener('input', updateCharCount);
        }
    }

    // ضبط ارتفاع الفيديو
    function adjustVideoHeight() {
        const videoWrapper = document.querySelector('.video-wrapper');
        if (videoWrapper) {
            const width = videoWrapper.clientWidth;
            const height = width * (9 / 16); // نسبة العرض إلى الارتفاع 16:9
            videoWrapper.style.height = `${height}px`;
        }
    }

    // إعداد اختصارات لوحة المفاتيح
    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', function(e) {
            // تجاهل إذا كان المستخدم يكتب في حقل نصي
            if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') {
                // Ctrl+S لحفظ الملاحظات
                if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                    e.preventDefault();
                    saveNotes();
                }
                return;
            }
            
            switch(e.key.toLowerCase()) {
                case 'arrowleft':
                case 'a':
                    e.preventDefault();
                    previousVideo();
                    break;
                case 'arrowright':
                case 'd':
                    e.preventDefault();
                    nextVideo();
                    break;
                case '1':
                    e.preventDefault();
                    document.querySelector('[data-tab="description"]')?.click();
                    break;
                case '2':
                    e.preventDefault();
                    document.querySelector('[data-tab="summary"]')?.click();
                    break;
                case '3':
                    e.preventDefault();
                    document.querySelector('[data-tab="notes"]')?.click();
                    document.getElementById('userNotes')?.focus();
                    break;
                case '4':
                    e.preventDefault();
                    document.querySelector('[data-tab="resources"]')?.click();
                    break;
                case ' ':
                    e.preventDefault();
                    togglePlayPause();
                    break;
                case 'f':
                    e.preventDefault();
                    toggleFullscreen();
                    break;
                case 'm':
                    e.preventDefault();
                    toggleMute();
                    break;
                case 'escape':
                    if (document.fullscreenElement) {
                        document.exitFullscreen();
                    }
                    break;
            }
        });
    }

    // تشغيل/إيقاف الفيديو
    function togglePlayPause() {
        showNotification('⏯️ تحكم في التشغيل غير متاح حالياً', 'info');
    }

    // كتم/إلغاء كتم الصوت
    function toggleMute() {
        showNotification('🔇 تحكم في الصوت غير متاح حالياً', 'info');
    }

    // ملء الشاشة
    window.toggleFullscreen = function() {
        const videoSection = document.querySelector('.video-section') || document.documentElement;
        
        if (!document.fullscreenElement) {
            if (videoSection.requestFullscreen) {
                videoSection.requestFullscreen();
            }
            showNotification('🖥️ تم تفعيل وضع ملء الشاشة', 'info');
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
            showNotification('📱 تم الخروج من وضع ملء الشاشة', 'info');
        }
    };

    // إظهار/إخفاء مساعدة الاختصارات
    function toggleShortcutsHelp() {
        const helpElement = document.getElementById('shortcutsHelp');
        if (helpElement) {
            helpElement.classList.toggle('show');
        }
    }

    // نسخ الوصف
    window.copyDescription = function() {
        const description = document.getElementById('videoDescription')?.textContent;
        if (description) {
            navigator.clipboard.writeText(description).then(() => {
                showNotification('📋 تم نسخ الوصف إلى الحافظة', 'success');
            });
        }
    };

    // تنزيل الملخص
    window.downloadSummary = function() {
        const summary = document.getElementById('videoSummary')?.innerHTML;
        if (summary) {
            const blob = new Blob([summary], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'ملخص-الدرس.html';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showNotification('📥 تم تنزيل الملخص', 'success');
        }
    };

    // مشاركة الكورس
    window.shareCourse = function() {
        if (navigator.share) {
            navigator.share({
                title: sessionData.course.title,
                text: `أتعلم ${sessionData.course.title} على منصة MASAR`,
                url: window.location.href,
            })
            .then(() => showNotification('🤝 تم المشاركة بنجاح', 'success'))
            .catch(() => showNotification('❌ فشلت المشاركة', 'warning'));
        } else {
            navigator.clipboard.writeText(window.location.href).then(() => {
                showNotification('🔗 تم نسخ رابط الكورس إلى الحافظة', 'success');
            });
        }
    };

    // إكمال الكورس
    window.markCourseComplete = function(auto = false) {
        if (!auto && !confirm('هل تريد وضع علامة على هذا الكورس كمكتمل؟')) {
            return;
        }
        
        const lessons = sessionData.courseLessons;
        let allCompleted = true;
        
        // وضع علامة على جميع الدروس كمكتملة
        lessons.forEach(lesson => {
            if (!lesson.completed) {
                lesson.completed = true;
                allCompleted = false;
            }
        });
        
        if (allCompleted) {
            showNotification('🏅 الكورس مكتمل بالفعل!', 'info');
            return;
        }
        
        updateProgress();
        updateLessonsList();
        
        // تحديث إحصائيات المستخدم
        const userProgress = JSON.parse(localStorage.getItem('userProgress')) || {};
        userProgress.completedCourses = (userProgress.completedCourses || 0) + 1;
        localStorage.setItem('userProgress', JSON.stringify(userProgress));
        
        updatePlayerStats();
        
        showNotification('🏆 تم إكمال الكورس بنجاح!', 'success');
    };

    // تسجيل الخروج
    window.logout = function() {
        if (confirm('هل تريد تسجيل الخروج؟')) {
            // حذف بيانات الجلسة
            localStorage.removeItem('currentVideoSession');
            
            // إعادة التوجيه للصفحة الرئيسية
            window.location.href = 'index.html';
        }
    };

    // تنسيق النص في الملاحظات
    window.formatText = function(format) {
        const textarea = document.getElementById('userNotes');
        if (!textarea) return;
        
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = textarea.value.substring(start, end);
        
        let formattedText = '';
        switch(format) {
            case 'bold':
                formattedText = `**${selectedText}**`;
                break;
            case 'italic':
                formattedText = `*${selectedText}*`;
                break;
        }
        
        textarea.value = textarea.value.substring(0, start) + 
                         formattedText + 
                         textarea.value.substring(end);
        
        // تحديث عدد الحروف
        updateCharCount();
        
        // إعادة تحديد النص المنسق
        textarea.selectionStart = start;
        textarea.selectionEnd = start + formattedText.length;
        textarea.focus();
    };

    // إضافة نقطة تعداد
    window.addBulletPoint = function() {
        const textarea = document.getElementById('userNotes');
        if (!textarea) return;
        
        const cursorPos = textarea.selectionStart;
        const textBefore = textarea.value.substring(0, cursorPos);
        const textAfter = textarea.value.substring(cursorPos);
        
        textarea.value = textBefore + '• ' + textAfter;
        
        // نقل المؤشر بعد النقطة
        textarea.selectionStart = textarea.selectionEnd = cursorPos + 2;
        textarea.focus();
        
        // تحديث عدد الحروف
        updateCharCount();
    };

    // إظهار إشعار
    function showNotification(message, type = 'info') {
        const notification = document.getElementById('notification');
        
        if (!notification) return;
        
        notification.className = 'notification';
        notification.classList.add(type);
        
        let icon = 'info-circle';
        switch(type) {
            case 'success': icon = 'check-circle'; break;
            case 'warning': icon = 'exclamation-triangle'; break;
            case 'error': icon = 'times-circle'; break;
        }
        
        notification.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        `;
        
        notification.classList.add('show');
        
        // إزالة الإشعار بعد 3 ثواني
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    // ===== SEPARATE SCROLL FUNCTIONALITY =====

// إعداد scroll منفصل للدروس
function setupSeparateScroll() {
    const lessonsList = document.getElementById('lessonsList');
    const videoSection = document.querySelector('.video-section');
    
    if (!lessonsList || !videoSection) return;
    
    // إضافة مستمع للـ scroll
    lessonsList.addEventListener('scroll', function() {
        this.classList.toggle('scrolling', this.scrollTop > 0);
        
        // تحديث حالة الفيديو إذا لزم الأمر
        updateVideoOnLessonScroll(this);
    });
    
    // منع انتشار الـ scroll
    lessonsList.addEventListener('wheel', function(e) {
        const isAtTop = this.scrollTop === 0;
        const isAtBottom = this.scrollTop + this.clientHeight >= this.scrollHeight - 1;
        
        // منع انتشار الـ scroll للصفحة الرئيسية
        if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
            e.stopPropagation();
        }
    });
    
    // تحسين أداء الـ scroll
    let scrollTimeout;
    lessonsList.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);
        lessonsList.style.pointerEvents = 'none';
        
        scrollTimeout = setTimeout(() => {
            lessonsList.style.pointerEvents = 'auto';
        }, 100);
    });
}

// تحديث الفيديو عند التمرير في الدروس
function updateVideoOnLessonScroll(lessonsList) {
    const scrollPercentage = (lessonsList.scrollTop + lessonsList.clientHeight) / lessonsList.scrollHeight;
    
    // إضافة تأثيرات بناءً على موضع التمرير
    if (scrollPercentage > 0.8) {
        // قرب نهاية القائمة
        lessonsList.style.boxShadow = '0 0 25px rgba(102, 126, 234, 0.15)';
    } else if (scrollPercentage < 0.2) {
        // في بداية القائمة
        lessonsList.style.boxShadow = '0 0 20px rgba(102, 126, 234, 0.1)';
    } else {
        // في المنتصف
        lessonsList.style.boxShadow = '0 0 15px rgba(102, 126, 234, 0.05)';
    }
}

// ===== ADJUST VIDEO SIZE =====

// ضبط حجم الفيديو تلقائياً
function adjustVideoSize() {
    const videoWrapper = document.querySelector('.video-wrapper');
    const iframe = document.getElementById('youtubePlayer');
    
    if (!videoWrapper || !iframe) return;
    
    // حساب الحجم الأمثل بناءً على عرض الشاشة
    const width = videoWrapper.clientWidth;
    const optimalHeight = Math.min(width * 0.5625, 600); // 16:9 ratio, max 600px
    
    iframe.style.height = `${optimalHeight}px`;
    videoWrapper.style.height = `${optimalHeight}px`;
    
    // إضافة مستمع لتغيير الحجم
    window.addEventListener('resize', function() {
        setTimeout(adjustVideoSize, 100);
    });
}

// ===== ENHANCED INITIALIZATION =====

// تحديث دالة التهيئة
document.addEventListener('DOMContentLoaded', function() {
    // ... الكود الحالي ...
    
    // إضافة تحسينات جديدة
    setTimeout(() => {
        setupSeparateScroll();
        adjustVideoSize();
        setupSmoothTransitions();
    }, 500);
    
    // ... باقي الكود ...
});

// ===== SMOOTH TRANSITIONS SETUP =====

// إعداد الانتقالات السلسة
function setupSmoothTransitions() {
    // تحسين أداء الـ hover
    document.querySelectorAll('.lesson-item, .course-card, .roadmap-stage-card').forEach(element => {
        element.style.willChange = 'transform, box-shadow';
    });
    
    // تنظيف will-change بعد الانتقال
    setTimeout(() => {
        document.querySelectorAll('.lesson-item, .course-card, .roadmap-stage-card').forEach(element => {
            element.style.willChange = 'auto';
        });
    }, 1000);
}

    // البدء
    initPlayer();
});