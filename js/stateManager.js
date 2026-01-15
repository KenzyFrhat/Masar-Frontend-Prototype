// stateManager.js - نظام إدارة الحالة المركزي
const StateManager = {
    // المفاتيح الأساسية للتخزين
    KEYS: {
        USER: 'masar_user',
        ONBOARDING: 'masar_onboarding',
        PROGRESS: 'masar_progress',
        SETTINGS: 'masar_settings'
    },

    // بيانات المستخدم الافتراضية
    DEFAULT_DATA: {
        user: {
            name: 'زائر',
            email: '',
            level: 'مبتدئ'
        },
        onboarding: {
            completed: false,
            answers: [],
            learningStyle: '',
            timeAvailability: 60
        },
        progress: {
            overall: 0,
            stages: [],
            completedCourses: 0,
            totalHours: 0,
            streak: 0
        }
    },

    // تهيئة التطبيق
    init: function() {
        this.ensureDefaultData();
        return this.getUser();
    },

    // التأكد من وجود البيانات الافتراضية
    ensureDefaultData: function() {
        Object.keys(this.KEYS).forEach(key => {
            const storageKey = this.KEYS[key];
            if (!localStorage.getItem(storageKey)) {
                const defaultData = this.DEFAULT_DATA[key.toLowerCase()] || {};
                this.save(storageKey, defaultData);
            }
        });
    },

    // الحفظ
    save: function(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('خطأ في الحفظ:', error);
            return false;
        }
    },

    // القراءة
    load: function(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('خطأ في القراءة:', error);
            return null;
        }
    },

    // الحصول على بيانات المستخدم
    getUser: function() {
        return this.load(this.KEYS.USER) || this.DEFAULT_DATA.user;
    },

    // تحديث بيانات المستخدم
    updateUser: function(data) {
        const user = this.getUser();
        const updatedUser = { ...user, ...data };
        return this.save(this.KEYS.USER, updatedUser);
    },

    // الحصول على بيانات التسجيل
    getOnboarding: function() {
        return this.load(this.KEYS.ONBOARDING) || this.DEFAULT_DATA.onboarding;
    },

    // تحديث بيانات التسجيل
    updateOnboarding: function(data) {
        return this.save(this.KEYS.ONBOARDING, data);
    },

    // الحصول على بيانات التقدم
    getProgress: function() {
        return this.load(this.KEYS.PROGRESS) || this.DEFAULT_DATA.progress;
    },

    // تحديث بيانات التقدم
    updateProgress: function(data) {
        const progress = this.getProgress();
        const updatedProgress = { ...progress, ...data };
        return this.save(this.KEYS.PROGRESS, updatedProgress);
    },

    // تحديث تقدم الدرس
    updateLessonProgress: function(lessonId, completed = true) {
        const progress = this.getProgress();
        
        if (!progress.lessons) {
            progress.lessons = {};
        }
        
        progress.lessons[lessonId] = {
            completed,
            completedAt: new Date().toISOString(),
            timesCompleted: (progress.lessons[lessonId]?.timesCompleted || 0) + 1
        };

        // تحديث الإحصائيات
        progress.completedCourses = Object.keys(progress.lessons).filter(
            key => progress.lessons[key].completed
        ).length;

        return this.updateProgress(progress);
    },

    // تسجيل وقت التعلم
    logLearningTime: function(minutes) {
        const progress = this.getProgress();
        progress.totalHours = (progress.totalHours || 0) + (minutes / 60);
        
        // تحديد Streak
        const today = new Date().toDateString();
        if (!progress.lastLearningDate || 
            new Date(progress.lastLearningDate).toDateString() !== today) {
            progress.streak = (progress.streak || 0) + 1;
            progress.lastLearningDate = today;
        }

        return this.updateProgress(progress);
    },

    // تسجيل الخروج
    logout: function() {
        // يمكنك اختيار ما تريد حفظه بعد تسجيل الخروج
        // هذا مثال لحفظ التقدم فقط
        const progress = this.getProgress();
        localStorage.clear();
        this.save(this.KEYS.PROGRESS, progress);
        return true;
    }
};