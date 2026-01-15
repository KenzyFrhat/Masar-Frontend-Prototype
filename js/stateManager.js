/**
 * ==============================================
 * نظام إدارة حالة مشروع مسار (MASAR)
 * State Management System for MASAR Project
 * ==============================================
 * الإصدار: 1.0.0
 * التاريخ: 2024
 * ==============================================
 */

(function() {
    'use strict';
    
    /**
     * ===== النظام الأساسي لإدارة الحالة =====
     */
    const StateManager = {
        
        // ===== الثوابت والمفاتيح =====
        KEYS: {
            USER: 'masar_user',
            ONBOARDING: 'masar_onboarding',
            PROGRESS: 'masar_progress',
            SETTINGS: 'masar_settings',
            LEARNING_PATH: 'masar_learning_path',
            ACTIVITY: 'masar_activity',
            ACHIEVEMENTS: 'masar_achievements'
        },
        
        // ===== البيانات الافتراضية =====
        DEFAULT_DATA: {
            user: {
                id: this.generateId(),
                name: 'زائر',
                email: '',
                avatar: '',
                level: 'مبتدئ',
                registrationDate: new Date().toISOString(),
                lastLogin: new Date().toISOString(),
                preferences: {
                    theme: 'light',
                    language: 'ar',
                    notifications: {
                        email: true,
                        push: true,
                        dailyReminder: true
                    }
                }
            },
            
            onboarding: {
                completed: false,
                completedAt: null,
                answers: [],
                results: {
                    learningStyle: null,
                    timeAvailability: 60, // دقائق يومياً
                    skillLevel: 'beginner',
                    goals: [],
                    challenges: []
                }
            },
            
            progress: {
                overall: 0,
                stages: [],
                completedCourses: 0,
                totalHours: 0,
                streak: 0,
                lastLearningDate: null,
                lessons: {}, // تخزين حالة كل درس
                dailyStats: {
                    today: {
                        date: new Date().toDateString(),
                        timeSpent: 0, // بالدقائق
                        lessonsCompleted: 0,
                        streakUpdated: false
                    }
                }
            },
            
            learningPath: {
                id: 'default-path',
                title: 'مسار تطوير الويب الشامل',
                description: 'من الصفر إلى الاحتراف في تطوير الويب',
                stages: [],
                currentStage: null,
                currentLesson: null,
                estimatedCompletion: null,
                lastUpdated: new Date().toISOString()
            },
            
            settings: {
                theme: 'light',
                language: 'ar',
                autoplay: true,
                playbackSpeed: 1.0,
                subtitles: false,
                downloadQuality: 'medium'
            },
            
            activity: {
                logs: [],
                streaks: [],
                achievements: []
            }
        },
        
        // ===== الوظائف الأساسية =====
        
        /**
         * تهيئة النظام
         */
        init: function() {
            console.log('🚀 تهيئة StateManager...');
            
            try {
                this.ensureDefaultData();
                this.migrateOldData();
                this.updateDailyStats();
                
                const user = this.getUser();
                console.log(`👤 المستخدم: ${user.name}`);
                
                return {
                    success: true,
                    user: user,
                    progress: this.getProgress()
                };
            } catch (error) {
                console.error('❌ خطأ في تهيئة StateManager:', error);
                return {
                    success: false,
                    error: error.message
                };
            }
        },
        
        /**
         * التأكد من وجود البيانات الافتراضية
         */
        ensureDefaultData: function() {
            console.log('🔍 التأكد من البيانات الافتراضية...');
            
            Object.entries(this.KEYS).forEach(([keyName, storageKey]) => {
                if (!localStorage.getItem(storageKey)) {
                    const dataType = keyName.toLowerCase();
                    const defaultData = this.DEFAULT_DATA[dataType] || {};
                    
                    console.log(`➕ إنشاء بيانات افتراضية لـ: ${dataType}`);
                    this.save(storageKey, defaultData);
                }
            });
            
            console.log('✅ تم التأكد من جميع البيانات');
        },
        
        /**
         * ترحيل البيانات القديمة (إذا كانت موجودة)
         */
        migrateOldData: function() {
            console.log('🔄 ترحيل البيانات القديمة...');
            
            // بيانات المستخدم القديمة
            const oldUserData = localStorage.getItem('masarUser');
            const oldOnboarding = localStorage.getItem('masarOnboarding');
            const oldAnswers = localStorage.getItem('masarUserAnswers');
            
            if (oldUserData) {
                try {
                    const parsedData = JSON.parse(oldUserData);
                    this.updateUser(parsedData);
                    localStorage.removeItem('masarUser');
                    console.log('✅ تم ترحيل بيانات المستخدم القديمة');
                } catch (error) {
                    console.warn('⚠️ خطأ في ترحيل بيانات المستخدم القديمة:', error);
                }
            }
            
            if (oldOnboarding) {
                try {
                    const parsedData = JSON.parse(oldOnboarding);
                    this.updateOnboarding(parsedData);
                    localStorage.removeItem('masarOnboarding');
                    console.log('✅ تم ترحيل بيانات التسجيل القديمة');
                } catch (error) {
                    console.warn('⚠️ خطأ في ترحيل بيانات التسجيل القديمة:', error);
                }
            }
            
            if (oldAnswers) {
                try {
                    const parsedData = JSON.parse(oldAnswers);
                    this.saveOnboardingAnswers(parsedData);
                    localStorage.removeItem('masarUserAnswers');
                    console.log('✅ تم ترحيل إجابات التسجيل');
                } catch (error) {
                    console.warn('⚠️ خطأ في ترحيل إجابات التسجيل:', error);
                }
            }
            
            // بيانات الجلسة الحالية
            const currentSession = localStorage.getItem('currentVideoSession');
            if (currentSession) {
                try {
                    const sessionData = JSON.parse(currentSession);
                    if (sessionData.lesson && sessionData.lesson.id) {
                        // تسجيل بدء الدرس
                        this.updateLessonProgress(sessionData.lesson.id, false);
                    }
                } catch (error) {
                    console.warn('⚠️ خطأ في معالجة جلسة الفيديو:', error);
                }
            }
        },
        
        /**
         * حفظ البيانات
         */
        save: function(key, data) {
            try {
                localStorage.setItem(key, JSON.stringify(data));
                return {
                    success: true,
                    key: key,
                    timestamp: new Date().toISOString()
                };
            } catch (error) {
                console.error(`❌ خطأ في حفظ البيانات للمفتاح ${key}:`, error);
                return {
                    success: false,
                    error: error.message,
                    key: key
                };
            }
        },
        
        /**
         * قراءة البيانات
         */
        load: function(key) {
            try {
                const data = localStorage.getItem(key);
                return data ? JSON.parse(data) : null;
            } catch (error) {
                console.error(`❌ خطأ في قراءة البيانات للمفتاح ${key}:`, error);
                return null;
            }
        },
        
        /**
         * حذف البيانات
         */
        remove: function(key) {
            try {
                localStorage.removeItem(key);
                return {
                    success: true,
                    key: key
                };
            } catch (error) {
                console.error(`❌ خطأ في حذف البيانات للمفتاح ${key}:`, error);
                return {
                    success: false,
                    error: error.message,
                    key: key
                };
            }
        },
        
        /**
         * مسح جميع البيانات (للتنظيف)
         */
        clearAll: function() {
            try {
                Object.values(this.KEYS).forEach(key => {
                    localStorage.removeItem(key);
                });
                console.log('🧹 تم مسح جميع البيانات');
                return {
                    success: true,
                    message: 'تم مسح جميع البيانات بنجاح'
                };
            } catch (error) {
                console.error('❌ خطأ في مسح جميع البيانات:', error);
                return {
                    success: false,
                    error: error.message
                };
            }
        },
        
        // ===== إدارة بيانات المستخدم =====
        
        /**
         * الحصول على بيانات المستخدم
         */
        getUser: function() {
            const user = this.load(this.KEYS.USER);
            return user || { ...this.DEFAULT_DATA.user };
        },
        
        /**
         * تحديث بيانات المستخدم
         */
        updateUser: function(data) {
            const currentUser = this.getUser();
            const updatedUser = {
                ...currentUser,
                ...data,
                lastUpdated: new Date().toISOString()
            };
            
            const result = this.save(this.KEYS.USER, updatedUser);
            
            if (result.success) {
                console.log('✅ تم تحديث بيانات المستخدم:', data.name || 'بيانات جديدة');
                this.logActivity('user_updated', { changes: Object.keys(data) });
            }
            
            return result;
        },
        
        /**
         * تحديث آخر تسجيل دخول
         */
        updateLastLogin: function() {
            return this.updateUser({
                lastLogin: new Date().toISOString()
            });
        },
        
        /**
         * تحديث تفضيلات المستخدم
         */
        updatePreferences: function(preferences) {
            const currentUser = this.getUser();
            const updatedPreferences = {
                ...currentUser.preferences,
                ...preferences
            };
            
            return this.updateUser({
                preferences: updatedPreferences
            });
        },
        
        // ===== إدارة عملية التسجيل =====
        
        /**
         * الحصول على بيانات التسجيل
         */
        getOnboarding: function() {
            const onboarding = this.load(this.KEYS.ONBOARDING);
            return onboarding || { ...this.DEFAULT_DATA.onboarding };
        },
        
        /**
         * حفظ إجابات التسجيل
         */
        saveOnboardingAnswers: function(answers) {
            const onboardingData = {
                completed: true,
                completedAt: new Date().toISOString(),
                answers: answers,
                results: this.processOnboardingAnswers(answers)
            };
            
            const result = this.save(this.KEYS.ONBOARDING, onboardingData);
            
            if (result.success) {
                console.log('✅ تم حفظ إجابات التسجيل:', answers.length, 'إجابة');
                
                // إذا كان الاسم موجوداً في الإجابات، قم بتحديث بيانات المستخدم
                if (answers.name) {
                    this.updateUser({ name: answers.name });
                }
                
                this.logActivity('onboarding_completed', {
                    questionCount: answers.length,
                    learningStyle: onboardingData.results.learningStyle
                });
                
                // إنشاء مسار تعلم مبدئي
                this.generateInitialLearningPath(onboardingData.results);
            }
            
            return result;
        },
        
        /**
         * معالجة إجابات التسجيل
         */
        processOnboardingAnswers: function(answers) {
            const results = {
                learningStyle: 'mixed',
                timeAvailability: 60,
                skillLevel: 'beginner',
                goals: [],
                challenges: []
            };
            
            // تحليل نمط التعلم
            const learningStyles = {
                visual: 0,
                auditory: 0,
                reading: 0,
                kinesthetic: 0
            };
            
            // معالجة كل إجابة
            Object.values(answers).forEach(answer => {
                if (typeof answer === 'string') {
                    if (answer.includes('فيديو') || answer.includes('صور')) learningStyles.visual++;
                    if (answer.includes('صوت') || answer.includes('سمع')) learningStyles.auditory++;
                    if (answer.includes('قراءة') || answer.includes('نص')) learningStyles.reading++;
                    if (answer.includes('تطبيق') || answer.includes('عملي')) learningStyles.kinesthetic++;
                }
            });
            
            // تحديد النمط السائد
            const maxScore = Math.max(...Object.values(learningStyles));
            const dominantStyle = Object.keys(learningStyles).find(
                key => learningStyles[key] === maxScore
            );
            
            results.learningStyle = dominantStyle || 'mixed';
            
            // معالجة الوقت المتاح
            if (answers.timeAvailability) {
                if (answers.timeAvailability.includes('قليل')) results.timeAvailability = 30;
                else if (answers.timeAvailability.includes('متوسط')) results.timeAvailability = 60;
                else if (answers.timeAvailability.includes('كثير')) results.timeAvailability = 120;
            }
            
            // معالجة مستوى المهارة
            if (answers.skillLevel) {
                results.skillLevel = answers.skillLevel;
            }
            
            // معالجة الأهداف
            if (answers.learningGoals) {
                results.goals = Array.isArray(answers.learningGoals) 
                    ? answers.learningGoals 
                    : [answers.learningGoals];
            }
            
            // معالجة التحديات
            if (answers.challenges) {
                results.challenges = Array.isArray(answers.challenges)
                    ? answers.challenges
                    : [answers.challenges];
            }
            
            return results;
        },
        
        /**
         * التحقق من اكتمال التسجيل
         */
        isOnboardingCompleted: function() {
            const onboarding = this.getOnboarding();
            return onboarding.completed === true;
        },
        
        // ===== إدارة التقدم =====
        
        /**
         * الحصول على بيانات التقدم
         */
        getProgress: function() {
            const progress = this.load(this.KEYS.PROGRESS);
            return progress || { ...this.DEFAULT_DATA.progress };
        },
        
        /**
         * تحديث بيانات التقدم العامة
         */
        updateProgress: function(data) {
            const currentProgress = this.getProgress();
            const updatedProgress = {
                ...currentProgress,
                ...data,
                lastUpdated: new Date().toISOString()
            };
            
            // تحديث النسبة العامة
            if (updatedProgress.lessons) {
                const totalLessons = Object.keys(updatedProgress.lessons).length;
                const completedLessons = Object.values(updatedProgress.lessons).filter(
                    lesson => lesson.completed
                ).length;
                
                if (totalLessons > 0) {
                    updatedProgress.overall = Math.round((completedLessons / totalLessons) * 100);
                    updatedProgress.completedCourses = completedLessons;
                }
            }
            
            const result = this.save(this.KEYS.PROGRESS, updatedProgress);
            
            if (result.success) {
                console.log('📊 تم تحديث التقدم:', updatedProgress.overall + '%');
            }
            
            return result;
        },
        
        /**
         * تحديث تقدم درس معين
         */
        updateLessonProgress: function(lessonId, completed = true, duration = null) {
            const progress = this.getProgress();
            
            if (!progress.lessons) {
                progress.lessons = {};
            }
            
            const currentLesson = progress.lessons[lessonId] || {};
            const now = new Date().toISOString();
            
            progress.lessons[lessonId] = {
                ...currentLesson,
                id: lessonId,
                completed: completed,
                lastAttempt: now,
                timesCompleted: (currentLesson.timesCompleted || 0) + (completed ? 1 : 0),
                totalTimeSpent: (currentLesson.totalTimeSpent || 0) + (duration || 0),
                completedAt: completed ? now : currentLesson.completedAt
            };
            
            // إذا اكتمل الدرس، تحديث الإحصائيات اليومية
            if (completed) {
                this.updateDailyStats({
                    lessonsCompleted: 1,
                    timeSpent: duration || 0
                });
                
                // التحقق من Streak
                this.updateStreak();
                
                // تسجيل النشاط
                this.logActivity('lesson_completed', {
                    lessonId: lessonId,
                    duration: duration
                });
                
                console.log(`🎉 تم إكمال الدرس: ${lessonId}`);
            } else {
                console.log(`▶️ بدء الدرس: ${lessonId}`);
            }
            
            return this.updateProgress(progress);
        },
        
        /**
         * الحصول على حالة درس معين
         */
        getLessonProgress: function(lessonId) {
            const progress = this.getProgress();
            return progress.lessons ? progress.lessons[lessonId] || null : null;
        },
        
        /**
         * تسجيل وقت التعلم
         */
        logLearningTime: function(minutes, lessonId = null) {
            const progress = this.getProgress();
            
            // تحديث الوقت الإجمالي
            progress.totalHours = (progress.totalHours || 0) + (minutes / 60);
            
            // إذا كان هناك معرف درس، تحديث وقت ذلك الدرس
            if (lessonId) {
                if (!progress.lessons) {
                    progress.lessons = {};
                }
                
                if (!progress.lessons[lessonId]) {
                    progress.lessons[lessonId] = {};
                }
                
                progress.lessons[lessonId].totalTimeSpent = 
                    (progress.lessons[lessonId].totalTimeSpent || 0) + minutes;
            }
            
            // تحديث الإحصائيات اليومية
            this.updateDailyStats({
                timeSpent: minutes
            });
            
            console.log(`⏱️ تم تسجيل ${minutes} دقيقة من التعلم`);
            
            return this.updateProgress(progress);
        },
        
        /**
         * تحديث الإحصائيات اليومية
         */
        updateDailyStats: function(stats = {}) {
            const progress = this.getProgress();
            
            if (!progress.dailyStats) {
                progress.dailyStats = { ...this.DEFAULT_DATA.progress.dailyStats };
            }
            
            const today = new Date().toDateString();
            
            // إذا كان اليوم مختلفاً، إعادة تعيين الإحصائيات
            if (progress.dailyStats.today.date !== today) {
                progress.dailyStats.today = {
                    date: today,
                    timeSpent: 0,
                    lessonsCompleted: 0,
                    streakUpdated: false
                };
            }
            
            // تحديث الإحصائيات
            progress.dailyStats.today = {
                ...progress.dailyStats.today,
                ...stats
            };
            
            return this.updateProgress(progress);
        },
        
        /**
         * تحديث الـ Streak
         */
        updateStreak: function() {
            const progress = this.getProgress();
            const today = new Date().toDateString();
            
            // إذا تم تحديث الـ Streak اليوم مسبقاً، لا تفعل شيئاً
            if (progress.dailyStats && progress.dailyStats.today.streakUpdated) {
                return progress.streak;
            }
            
            let newStreak = progress.streak || 0;
            
            if (!progress.lastLearningDate) {
                // أول مرة يتعلم
                newStreak = 1;
            } else {
                const lastDate = new Date(progress.lastLearningDate);
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                
                if (lastDate.toDateString() === yesterday.toDateString() ||
                    lastDate.toDateString() === today) {
                    // التعلم مستمر
                    newStreak = (progress.streak || 0) + 1;
                } else if (lastDate.toDateString() !== today) {
                    // انقطع الـ Streak
                    newStreak = 1;
                }
            }
            
            progress.streak = newStreak;
            progress.lastLearningDate = today;
            
            if (progress.dailyStats) {
                progress.dailyStats.today.streakUpdated = true;
            }
            
            this.updateProgress(progress);
            
            console.log(`🔥 الـ Streak الجديد: ${newStreak} أيام`);
            
            return newStreak;
        },
        
        /**
         * الحصول على الدرس التالي المقترح
         */
        getNextLesson: function() {
            const progress = this.getProgress();
            const learningPath = this.getLearningPath();
            
            if (!learningPath.stages || learningPath.stages.length === 0) {
                return null;
            }
            
            // البحث عن أول درس غير مكتمل
            for (const stage of learningPath.stages) {
                if (!stage.courses || stage.courses.length === 0) continue;
                
                for (const course of stage.courses) {
                    if (!course.lessons || course.lessons.length === 0) continue;
                    
                    for (const lesson of course.lessons) {
                        const lessonProgress = this.getLessonProgress(lesson.id);
                        if (!lessonProgress || !lessonProgress.completed) {
                            return {
                                stage: stage,
                                course: course,
                                lesson: lesson,
                                progress: lessonProgress
                            };
                        }
                    }
                }
            }
            
            return null; // جميع الدروس مكتملة
        },
        
        // ===== إدارة مسار التعلم =====
        
        /**
         * الحصول على مسار التعلم
         */
        getLearningPath: function() {
            const path = this.load(this.KEYS.LEARNING_PATH);
            return path || { ...this.DEFAULT_DATA.learningPath };
        },
        
        /**
         * تحديث مسار التعلم
         */
        updateLearningPath: function(data) {
            const currentPath = this.getLearningPath();
            const updatedPath = {
                ...currentPath,
                ...data,
                lastUpdated: new Date().toISOString()
            };
            
            const result = this.save(this.KEYS.LEARNING_PATH, updatedPath);
            
            if (result.success) {
                console.log('🗺️ تم تحديث مسار التعلم:', updatedPath.title);
            }
            
            return result;
        },
        
        /**
         * إنشاء مسار تعلم مبدئي بناءً على نتائج التسجيل
         */
        generateInitialLearningPath: function(onboardingResults) {
            const learningPath = {
                id: 'personalized-path-' + this.generateId(),
                title: 'مسارك التعليمي الشخصي',
                description: 'مسار مخصص بناءً على تفضيلاتك وأهدافك',
                stages: this.generateStages(onboardingResults),
                currentStage: 'stage-1',
                currentLesson: null,
                estimatedCompletion: this.calculateEstimatedCompletion(onboardingResults),
                lastUpdated: new Date().toISOString()
            };
            
            return this.updateLearningPath(learningPath);
        },
        
        /**
         * توليد المراحل بناءً على نتائج التسجيل
         */
        generateStages: function(onboardingResults) {
            // هذا مثال مبسط - يمكنك توسيعه حسب احتياجاتك
            const stages = [
                {
                    id: 'stage-1',
                    title: 'أساسيات البرمجة',
                    description: 'بناء الأساس القوي',
                    order: 1,
                    courses: [
                        {
                            id: 'html-css-basics',
                            title: 'HTML & CSS للمبتدئين',
                            description: 'تعلم بناء وتصميم صفحات الويب',
                            icon: 'fab fa-html5',
                            lessons: [
                                {
                                    id: 'html-intro',
                                    title: 'مقدمة إلى HTML',
                                    description: 'تعلم أساسيات HTML',
                                    duration: '30:15',
                                    youtubeId: 'qz0aGYrrlhU'
                                }
                            ]
                        }
                    ]
                }
            ];
            
            // تخصيص بناءً على نمط التعلم
            if (onboardingResults.learningStyle === 'visual') {
                // إضافة المزيد من الدروس المرئية
            }
            
            return stages;
        },
        
        /**
         * حساب الوقت المقدر للإكمال
         */
        calculateEstimatedCompletion: function(onboardingResults) {
            const estimatedHours = 80; // ساعات تقريبية للبرنامج
            const dailyMinutes = onboardingResults.timeAvailability || 60;
            const dailyHours = dailyMinutes / 60;
            
            const daysNeeded = Math.ceil(estimatedHours / dailyHours);
            const completionDate = new Date();
            completionDate.setDate(completionDate.getDate() + daysNeeded);
            
            return completionDate.toISOString();
        },
        
        // ===== إدارة النشاط =====
        
        /**
         * تسجيل نشاط
         */
        logActivity: function(type, data = {}) {
            const activity = this.load(this.KEYS.ACTIVITY) || { ...this.DEFAULT_DATA.activity };
            
            if (!activity.logs) {
                activity.logs = [];
            }
            
            const logEntry = {
                id: this.generateId(),
                type: type,
                data: data,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent
            };
            
            activity.logs.unshift(logEntry); // إضافة في البداية
            
            // الحفاظ على آخر 100 سجل فقط
            if (activity.logs.length > 100) {
                activity.logs = activity.logs.slice(0, 100);
            }
            
            const result = this.save(this.KEYS.ACTIVITY, activity);
            
            if (result.success) {
                console.log(`📝 تم تسجيل النشاط: ${type}`);
            }
            
            return result;
        },
        
        /**
         * الحصول على سجل النشاط
         */
        getActivityLogs: function(limit = 20) {
            const activity = this.load(this.KEYS.ACTIVITY) || { ...this.DEFAULT_DATA.activity };
            return activity.logs ? activity.logs.slice(0, limit) : [];
        },
        
        // ===== الإعدادات =====
        
        /**
         * الحصول على الإعدادات
         */
        getSettings: function() {
            const settings = this.load(this.KEYS.SETTINGS);
            return settings || { ...this.DEFAULT_DATA.settings };
        },
        
        /**
         * تحديث الإعدادات
         */
        updateSettings: function(data) {
            const currentSettings = this.getSettings();
            const updatedSettings = {
                ...currentSettings,
                ...data,
                lastUpdated: new Date().toISOString()
            };
            
            const result = this.save(this.KEYS.SETTINGS, updatedSettings);
            
            if (result.success) {
                console.log('⚙️ تم تحديث الإعدادات');
                
                // إذا تم تغيير السمة، تطبيقها فوراً
                if (data.theme && data.theme !== currentSettings.theme) {
                    this.applyTheme(data.theme);
                }
            }
            
            return result;
        },
        
        /**
         * تطبيق السمة
         */
        applyTheme: function(theme) {
            document.documentElement.setAttribute('data-theme', theme);
            console.log(`🎨 تم تطبيق السمة: ${theme}`);
        },
        
        // ===== الأدوات المساعدة =====
        
        /**
         * توليد معرف فريد
         */
        generateId: function() {
            return 'id-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        },
        
        /**
         * التحقق من دعم localStorage
         */
        isLocalStorageSupported: function() {
            try {
                const testKey = '__test__';
                localStorage.setItem(testKey, testKey);
                localStorage.removeItem(testKey);
                return true;
            } catch (error) {
                console.error('❌ localStorage غير مدعوم:', error);
                return false;
            }
        },
        
        /**
         * الحصول على حجم التخزين المستخدم
         */
        getStorageUsage: function() {
            try {
                let total = 0;
                for (let key in localStorage) {
                    if (localStorage.hasOwnProperty(key)) {
                        total += (localStorage[key].length * 2) / 1024; // بالكيلوبايت
                    }
                }
                return Math.round(total * 100) / 100; // تقريب لرقمين عشريين
            } catch (error) {
                console.error('❌ خطأ في حساب حجم التخزين:', error);
                return 0;
            }
        },
        
        /**
         * تصدير جميع البيانات (للنسخ الاحتياطي)
         */
        exportAllData: function() {
            try {
                const data = {};
                
                Object.entries(this.KEYS).forEach(([keyName, storageKey]) => {
                    data[keyName] = this.load(storageKey);
                });
                
                const exportData = {
                    version: '1.0',
                    exportDate: new Date().toISOString(),
                    data: data
                };
                
                return {
                    success: true,
                    data: exportData,
                    json: JSON.stringify(exportData, null, 2),
                    filename: `masar-backup-${new Date().toISOString().split('T')[0]}.json`
                };
            } catch (error) {
                console.error('❌ خطأ في تصدير البيانات:', error);
                return {
                    success: false,
                    error: error.message
                };
            }
        },
        
        /**
         * استيراد البيانات
         */
        importData: function(jsonData) {
            try {
                const importData = typeof jsonData === 'string' 
                    ? JSON.parse(jsonData) 
                    : jsonData;
                
                if (!importData.version || importData.version !== '1.0') {
                    throw new Error('إصدار ملف الاستيراد غير مدعوم');
                }
                
                Object.entries(importData.data).forEach(([keyName, data]) => {
                    const storageKey = this.KEYS[keyName];
                    if (storageKey && data) {
                        this.save(storageKey, data);
                    }
                });
                
                console.log('✅ تم استيراد البيانات بنجاح');
                return {
                    success: true,
                    message: 'تم استيراد البيانات بنجاح'
                };
            } catch (error) {
                console.error('❌ خطأ في استيراد البيانات:', error);
                return {
                    success: false,
                    error: error.message
                };
            }
        },
        
        /**
         * تسجيل الخروج (حفظ التقدم فقط)
         */
        logout: function() {
            console.log('👋 تسجيل الخروج...');
            
            try {
                // حفظ بيانات التقدم فقط
                const progress = this.getProgress();
                const settings = this.getSettings();
                
                // مسح جميع البيانات
                this.clearAll();
                
                // استعادة التقدم والإعدادات
                this.save(this.KEYS.PROGRESS, progress);
                this.save(this.KEYS.SETTINGS, settings);
                
                // إنشاء بيانات مستخدم جديدة
                this.save(this.KEYS.USER, {
                    ...this.DEFAULT_DATA.user,
                    lastLogin: new Date().toISOString()
                });
                
                this.logActivity('user_logout', { timestamp: new Date().toISOString() });
                
                return {
                    success: true,
                    message: 'تم تسجيل الخروج بنجاح'
                };
            } catch (error) {
                console.error('❌ خطأ في تسجيل الخروج:', error);
                return {
                    success: false,
                    error: error.message
                };
            }
        },
        
        /**
         * إعادة تعيين كاملة (للتطوير)
         */
        resetAll: function() {
            if (confirm('⚠️ هل أنت متأكد من إعادة تعيين جميع البيانات؟ هذا الإجراء لا يمكن التراجع عنه.')) {
                const result = this.clearAll();
                this.ensureDefaultData();
                return result;
            }
            return {
                success: false,
                message: 'تم إلغاء العملية'
            };
        },
        
        /**
         * الحصول على ملخص الأداء
         */
        getPerformanceSummary: function() {
            const user = this.getUser();
            const progress = this.getProgress();
            const onboarding = this.getOnboarding();
            
            return {
                user: {
                    name: user.name,
                    level: user.level,
                    joined: user.registrationDate
                },
                progress: {
                    overall: progress.overall || 0,
                    streak: progress.streak || 0,
                    totalHours: progress.totalHours || 0,
                    completedLessons: progress.completedCourses || 0
                },
                onboarding: {
                    completed: onboarding.completed || false,
                    learningStyle: onboarding.results?.learningStyle || 'غير معروف'
                },
                storage: {
                    usage: this.getStorageUsage() + ' KB',
                    supported: this.isLocalStorageSupported()
                }
            };
        }
        
    };
    
    // ===== التهيئة التلقائية =====
    // تهيئة StateManager تلقائياً عند التحميل
    window.addEventListener('DOMContentLoaded', function() {
        setTimeout(function() {
            const initResult = StateManager.init();
            
            if (initResult.success) {
                console.log('🚀 StateManager جاهز للعمل!');
                console.log('📊 ملخص الأداء:', StateManager.getPerformanceSummary());
            } else {
                console.error('❌ فشل تهيئة StateManager:', initResult.error);
            }
            
            // جعل StateManager متاحاً عالمياً
            window.StateManager = StateManager;
            
            // إطلاق حدث أن StateManager جاهز
            const event = new CustomEvent('stateManagerReady', { 
                detail: { success: initResult.success }
            });
            window.dispatchEvent(event);
            
        }, 100); // تأخير بسيط لضمان تحميل الصفحة
    });
    
    // جعل StateManager متاحاً مباشرة للاستخدام الفوري
    window.StateManager = StateManager;
    
    console.log('🛠️ StateManager تم تحميله بنجاح');
    
})();