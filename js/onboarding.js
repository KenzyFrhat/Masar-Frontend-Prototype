// ملف JavaScript لصفحة Onboarding
document.addEventListener('DOMContentLoaded', function () {
    // العناصر الأساسية
    const form = document.getElementById('onboardingForm');
    const questions = document.querySelectorAll('.question-card');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    const editPathBtn = document.getElementById('editPathBtn');
    const startPathBtn = document.getElementById('startPathBtn');
    const pathPreview = document.getElementById('pathPreview');
    const progressFill = document.getElementById('progressFill');
    const steps = document.querySelectorAll('.step');

    // متغيرات حالة
    let currentQuestion = 0;
    const totalQuestions = questions.length;
    const userAnswers = {};

    // تعيينات النصوص بناءً على الإجابات
    const answerTexts = {
        learningSpeed: {
            video: 'أفضل الشرح المرئي العملي',
            reading: 'أفضل القراءة المركزة والتحليل',
            mixed: 'مزيج من الشرح المرئي والقراءة'
        },
        contentOrganization: {
            chunks: 'مقاطع صغيرة مجزأة',
            continuous: 'شرح طويل مترابط'
        },
        theoryPractice: {
            practiceFirst: 'التطبيق العملي أولاً',
            theoryFirst: 'الفهم النظري أولاً'
        },
        peakTime: {
            morning: 'صباحي (الصباح الباكر)',
            evening: 'مسائي (المساء المتأخر)',
            dawn: 'فجري (وقت الفجر)'
        },
        dailyTime: {
            short: '15-30 دقيقة يومياً',
            medium: '1-2 ساعة يومياً',
            long: '3+ ساعات يومياً'
        },
        errorHelp: {
            hint: 'التلميحات للتفكير الذاتي',
            solution: 'الحل النهائي للمقارنة'
        },
        motivation: {
            leaderboard: 'التنافس وقوائم المتصدرين',
            rewards: 'المكافآت والشهادات',
            progress: 'رؤية التقدم المرئي'
        },
        studyEnvironment: {
            alone: 'الخلوة التامة والهدوء',
            group: 'مجموعات الدراسة',
            community: 'فردي مع مجتمع داعم'
        },
        frustrationResponse: {
            quit: 'البحث عن بديل سريع',
            discouraged: 'الاستمرار مع الحاجة للتشجيع',
            persistent: 'الثبات والصبر الطبيعي'
        },
        detailLevel: {
            detailed: 'تفصيل مفرط ودقيق',
            summary: 'ملخص وافي وشامل'
        }
    };

    // تهيئة الصفحة
    function initPage() {
        showQuestion(currentQuestion);
        updateProgress();
        updateNavigationButtons();
    }

    // عرض سؤال معين
    function showQuestion(index) {
        questions.forEach((question, i) => {
            question.classList.remove('active');
            if (i === index) {
                question.classList.add('active');
            }
        });

        // تحديث شريط التقدم
        steps.forEach((step, i) => {
            step.classList.remove('active', 'completed');
            if (i < index) {
                step.classList.add('completed');
            } else if (i === index) {
                step.classList.add('active');
            }
        });
    }

    // تحديث شريط التقدم
    function updateProgress() {
        const progressPercentage = ((currentQuestion + 1) / totalQuestions) * 100;
        progressFill.style.width = `${progressPercentage}%`;
    }

    // تحديث أزرار التنقل
    function updateNavigationButtons() {
        prevBtn.disabled = currentQuestion === 0;

        if (currentQuestion < totalQuestions - 1) {
            nextBtn.style.display = 'inline-flex';
            submitBtn.style.display = 'none';
            nextBtn.disabled = !isCurrentQuestionAnswered();
        } else {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'inline-flex';
            submitBtn.disabled = !isCurrentQuestionAnswered();
        }
    }

    // التحقق من إجابة السؤال الحالي
    function isCurrentQuestionAnswered() {
        const currentQuestionElement = questions[currentQuestion];
        const radioInputs = currentQuestionElement.querySelectorAll('input[type="radio"]');

        for (let input of radioInputs) {
            if (input.checked) {
                // حفظ الإجابة
                const questionName = input.name;
                userAnswers[questionName] = input.value;
                return true;
            }
        }
        return false;
    }

    // الانتقال للسؤال التالي
    function goToNextQuestion() {
        if (currentQuestion < totalQuestions - 1 && isCurrentQuestionAnswered()) {
            currentQuestion++;
            showQuestion(currentQuestion);
            updateProgress();
            updateNavigationButtons();

            // تمرير سلس للعنصر التالي
            questions[currentQuestion].scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    // الانتقال للسؤال السابق
    function goToPrevQuestion() {
        if (currentQuestion > 0) {
            currentQuestion--;
            showQuestion(currentQuestion);
            updateProgress();
            updateNavigationButtons();

            // تمرير سلس للعنصر السابق
            questions[currentQuestion].scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    // عرض معاينة المسار
    function showPathPreview() {
        if (areAllQuestionsAnswered()) {
            // تحديث ملخص المسار
            updatePathSummary();

            // إخفاء الأسئلة وإظهار المعاينة
            questions.forEach(q => q.style.display = 'none');
            pathPreview.style.display = 'block';
            document.querySelector('.navigation-buttons').style.display = 'none';

            // تمرير سلس للمعاينة
            pathPreview.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    // التحقق من إجابة جميع الأسئلة
    function areAllQuestionsAnswered() {
        const requiredQuestions = [
            'learningSpeed',
            'contentOrganization',
            'theoryPractice',
            'peakTime',
            'dailyTime',
            'errorHelp',
            'motivation',
            'studyEnvironment',
            'frustrationResponse',
            'detailLevel'
        ];
        return requiredQuestions.every(q => userAnswers[q]);
    }

    // ========== دالة updatePathSummary الكاملة المعدلة ==========
    function updatePathSummary() {
        // تحديث عناصر الملخص في HTML
        const summaryElements = [
            { id: 'summaryLearningSpeed', key: 'learningSpeed', label: 'أسلوب التعلم السريع', icon: 'fa-bolt' },
            { id: 'summaryContentOrg', key: 'contentOrganization', label: 'تنظيم المحتوى', icon: 'fa-layer-group' },
            { id: 'summaryApproach', key: 'theoryPractice', label: 'النظري vs العملي', icon: 'fa-balance-scale' },
            { id: 'summaryPeakTime', key: 'peakTime', label: 'وقت الذروة', icon: 'fa-clock' },
            { id: 'summaryDailyTime', key: 'dailyTime', label: 'الوقت اليومي', icon: 'fa-calendar-day' },
            { id: 'summaryErrorHelp', key: 'errorHelp', label: 'مساعدة الأخطاء', icon: 'fa-question-circle' },
            { id: 'summaryMotivation', key: 'motivation', label: 'المحفز الرئيسي', icon: 'fa-fire' },
            { id: 'summaryEnvironment', key: 'studyEnvironment', label: 'بيئة الدراسة', icon: 'fa-home' },
            { id: 'summaryFrustration', key: 'frustrationResponse', label: 'رد فعل الإحباط', icon: 'fa-heartbeat' },
            { id: 'summaryDetailLevel', key: 'detailLevel', label: 'مستوى التفاصيل', icon: 'fa-search' }
        ];

        // إنشاء HTML للملخص
        let summaryHTML = '';
        summaryElements.forEach(item => {
            const answer = userAnswers[item.key];
            const answerText = answer && answerTexts[item.key] && answerTexts[item.key][answer]
                ? answerTexts[item.key][answer]
                : 'لم يتم الإجابة';

            summaryHTML += `
                <div class="summary-item detailed">
                    <i class="fas ${item.icon}"></i>
                    <div>
                        <h4>${item.label}</h4>
                        <p>${answerText}</p>
                    </div>
                </div>
            `;
        });

        // تحديث القسم في HTML
        const summaryContainer = document.querySelector('.path-details');
        if (summaryContainer) {
            summaryContainer.innerHTML = `
                <div class="detailed-summary">
                    <h3><i class="fas fa-user-circle"></i> ملفك التعليمي الشخصي</h3>
                    <div class="summary-grid">
                        ${summaryHTML}
                    </div>
                </div>
            `;
        }

        // تحليل شخصية المتعلم وعرض التوصيات
        const learnerProfile = analyzeLearnerProfile();
        displayLearnerProfile(learnerProfile);
    }

    // دالة مساعدة: تحليل شخصية المتعلم
    function analyzeLearnerProfile() {
        const profile = {
            type: '',
            strengths: [],
            recommendations: []
        };

        // تحديد نوع المتعلم
        if (userAnswers.learningSpeed === 'video' && userAnswers.theoryPractice === 'practiceFirst') {
            profile.type = 'المتعلم العملي';
            profile.strengths.push('التعلم بالتجربة', 'السرعة في الاستيعاب العملي');
        } else if (userAnswers.learningSpeed === 'reading' && userAnswers.theoryPractice === 'theoryFirst') {
            profile.type = 'المتعلم النظري';
            profile.strengths.push('الفهم العميق', 'التحليل المنطقي');
        } else {
            profile.type = 'المتعلم المتوازن';
            profile.strengths.push('المرونة', 'التكيف مع مختلف أساليب التعلم');
        }

        // إضافة توصيات بناءً على الإجابات
        if (userAnswers.dailyTime === 'short') {
            profile.recommendations.push('جلسات تعلم قصيرة ومكثفة');
        }
        if (userAnswers.motivation === 'progress') {
            profile.recommendations.push('تتبع مرئي للتقدم');
        }
        if (userAnswers.errorHelp === 'hint') {
            profile.recommendations.push('نظام تلميحات ذكي');
        }
        if (userAnswers.studyEnvironment === 'community') {
            profile.recommendations.push('مجتمع داعم للاستشارة');
        }

        return profile;
    }

    // دالة مساعدة: عرض شخصية المتعلم
    function displayLearnerProfile(profile) {
        const profileContainer = document.querySelector('.path-details');
        if (profileContainer) {
            const profileHTML = `
                <div class="learner-profile">
                    <h3><i class="fas fa-user-graduate"></i> شخصيتك التعليمية: ${profile.type}</h3>
                    <div class="profile-details">
                        <div class="profile-strengths">
                            <h4><i class="fas fa-star"></i> نقاط قوتك:</h4>
                            <ul>
                                ${profile.strengths.map(strength => `<li>${strength}</li>`).join('')}
                            </ul>
                        </div>
                        <div class="profile-recommendations">
                            <h4><i class="fas fa-lightbulb"></i> توصياتنا لك:</h4>
                            <ul>
                                ${profile.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
            `;

            profileContainer.insertAdjacentHTML('beforeend', profileHTML);
        }
    }

    // العودة لتعديل الإجابات
    function editAnswers() {
        pathPreview.style.display = 'none';
        questions.forEach(q => q.style.display = 'block');
        document.querySelector('.navigation-buttons').style.display = 'flex';

        // العودة للسؤال الأول
        currentQuestion = 0;
        showQuestion(currentQuestion);
        updateProgress();
        updateNavigationButtons();

        // تمرير سلس للسؤال الأول
        questions[0].scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }

    // بدء المسار التعليمي
    // بدء المسار التعليمي - النسخة المصححة
    // function startLearningPath() {
    //     //console.log('🚀 بدء إنشاء المسار التعليمي...');

    //     // 1. حفظ الإجابات
    //     localStorage.setItem('masarUserAnswers', JSON.stringify(userAnswers));
    //     localStorage.setItem('masarOnboardingCompleted', 'true');
    //     localStorage.setItem('masarUserName', 'كريم');
    //     localStorage.setItem('masarUserJoinDate', new Date().toISOString());

    //     // 2. تحليل الشخصية
    //     const learnerProfile = analyzeLearnerProfile();
    //     localStorage.setItem('masarLearnerType', learnerProfile.type);

    //     // 3. إنشاء رسالة النجاح
    //     const message = document.createElement('div');
    //     message.id = 'successMessage';
    //     message.innerHTML = `
    //         <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
    //                    background: rgba(0,0,0,0.9); z-index: 10000; 
    //                    display: flex; justify-content: center; align-items: center;">
    //             <div style="background: white; padding: 40px; border-radius: 15px; 
    //                        text-align: center; max-width: 500px; width: 90%;">
    //                 <h2 style="color: #4361ee; margin-bottom: 20px;">🎉 تم إنشاء مسارك التعليمي!</h2>
    //                 <p style="margin-bottom: 30px;">جارٍ التوجيه للDashboard...</p>
    //                 <div id="countdown" style="color: #4361ee; font-size: 24px; 
    //                          font-weight: bold; margin: 20px 0;">3</div>
    //             </div>
    //         </div>
    //     `;

    //     document.body.appendChild(message);

    //     // 4. التأكد من ظهور الرسالة أولاً، ثم بدء العد التنازلي
    //     setTimeout(() => {
    //         let countdown = 3;
    //         const countdownElement = document.getElementById('countdown');

    //         const timer = setInterval(() => {
    //             countdown--;
    //             countdownElement.textContent = countdown;

    //             if (countdown <= 0) {
    //                 clearInterval(timer);

    //                 // إضافة تأثير fade out قبل الانتقال
    //                 message.style.opacity = '0';
    //                 message.style.transition = 'opacity 0.5s ease';

    //                 setTimeout(() => {
    //                     window.location.href = "dashboard.html";
    //                 }, 500); // الانتظار لانتهاء الانتقال
    //             }
    //         }, 1000);
    //     }, 100); // زيادة الوقت لضمان ظهور الرسالة
    // }
    function startLearningPath() {
        console.log('🚀 بدء إنشاء المسار التعليمي...');

        // 1. حفظ الإجابات
        localStorage.setItem('masarUserAnswers', JSON.stringify(userAnswers));
        localStorage.setItem('masarOnboardingCompleted', 'true');
        localStorage.setItem('masarUserName', 'كريم');
        localStorage.setItem('masarUserJoinDate', new Date().toISOString());

        // 2. تحليل الشخصية
        const learnerProfile = analyzeLearnerProfile();
        localStorage.setItem('masarLearnerType', learnerProfile.type);

        // 3. إنشاء رسالة النجاح مع Progress Bar
        const message = document.createElement('div');
        message.id = 'successMessage';
        message.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                   background: rgba(0,0,0,0.9); z-index: 10000; 
                   display: flex; justify-content: center; align-items: center;">
            <div style="background: white; padding: 40px; border-radius: 15px; 
                       text-align: center; max-width: 500px; width: 90%; 
                       box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
                <i class="fas fa-rocket" style="font-size: 48px; color: #4361ee; margin-bottom: 20px;"></i>
                <h2 style="color: #4361ee; margin-bottom: 15px;">🎉 تم إنشاء مسارك التعليمي!</h2>
                <p style="margin-bottom: 25px; color: #666; font-size: 16px;">
                    جارٍ إعداد لوحة التحكم الشخصية الخاصة بك...
                </p>
                
                <!-- Progress Bar Container -->
                <div style="background: #f0f0f0; border-radius: 10px; height: 12px; 
                           margin: 30px 0; overflow: hidden;">
                    <div id="progressBar" style="width: 0%; height: 100%; 
                           background: linear-gradient(90deg, #4361ee, #3a0ca3);
                           border-radius: 10px; transition: width 0.3s ease;
                           position: relative;">
                        <div style="position: absolute; right: 0; top: 0; height: 100%; 
                                   width: 20px; background: linear-gradient(90deg, rgba(255,255,255,0.3), transparent);
                                   border-radius: 0 10px 10px 0;"></div>
                    </div>
                </div>
                
                <!-- النسبة المئوية -->
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span id="progressText" style="color: #4361ee; font-weight: bold;">0%</span>
                    <span id="loadingStatus" style="color: #666; font-size: 14px;">
                        جارٍ التحميل...
                    </span>
                </div>
                
                <!-- رسائل تحميل ديناميكية -->
                <div id="loadingMessages" style="color: #888; font-size: 14px; 
                        min-height: 20px; margin-top: 10px;">
                    ⏳ جارٍ تحليل إجاباتك...
                </div>
                
                <!-- زر إلغاء (اختياري) -->
                <button id="cancelLoading" 
                        style="margin-top: 25px; padding: 8px 20px; 
                               background: #f0f0f0; border: none; 
                               border-radius: 5px; color: #666;
                               cursor: pointer; font-size: 14px;">
                    إلغاء
                </button>
            </div>
        </div>
    `;

        document.body.appendChild(message);

        // 4. بدء عملية التحميل
        setTimeout(() => {
            let progress = 0;
            const progressBar = document.getElementById('progressBar');
            const progressText = document.getElementById('progressText');
            const loadingStatus = document.getElementById('loadingStatus');
            const loadingMessages = document.getElementById('loadingMessages');

            // قائمة الرسائل الديناميكية
            const messages = [
                "⏳ جارٍ تحليل إجاباتك...",
                "🧠 تحديد شخصيتك التعليمية...",
                "📊 إنشاء مسار مخصص...",
                "🎨 تخصيص لوحة التحكم...",
                "🚀 جارٍ التوجيه للDashboard..."
            ];

            // محاكاة عملية التحميل لمدة 5 ثواني
            const totalTime = 5000; // 5 ثواني
            const intervalTime = 50; // تحديث كل 50ms
            const steps = totalTime / intervalTime;
            const increment = 100 / steps;
            let currentStep = 0;

            const interval = setInterval(() => {
                progress += increment;
                currentStep++;

                // تحديث الـ Progress Bar
                if (progress > 100) progress = 100;
                progressBar.style.width = `${progress}%`;
                progressText.textContent = `${Math.round(progress)}%`;

                // تحديث الرسالة كل 20%
                if (currentStep % (steps / 5) === 0) {
                    const messageIndex = Math.floor(progress / 20);
                    if (messageIndex < messages.length) {
                        loadingMessages.textContent = messages[messageIndex];
                    }
                }

                // تحديث حالة التحميل
                if (progress < 25) {
                    loadingStatus.textContent = "جارٍ التحميل...";
                } else if (progress < 50) {
                    loadingStatus.textContent = "تحليل البيانات...";
                } else if (progress < 75) {
                    loadingStatus.textContent = "تجهيز المسار...";
                } else {
                    loadingStatus.textContent = "جارٍ الإكمال...";
                }

                // عند اكتمال التحميل
                if (progress >= 100) {
                    clearInterval(interval);

                    // إظهار رسالة الإكمال
                    loadingMessages.innerHTML = "✅ <strong>جاهز!</strong> جارٍ التوجيه...";
                    loadingStatus.textContent = "مكتمل";

                    // إضافة تأثير fade out بعد ثانيتين
                    setTimeout(() => {
                        message.style.opacity = '0';
                        message.style.transition = 'opacity 0.8s ease';

                        setTimeout(() => {
                            window.location.href = "dashboard.html";
                        }, 800);
                    }, 2000);
                }
            }, intervalTime);

            // إضافة حدث زر الإلغاء
            const cancelBtn = document.getElementById('cancelLoading');
            if (cancelBtn) {
                cancelBtn.addEventListener('click', () => {
                    clearInterval(interval);
                    message.remove();
                    alert('تم إلغاء عملية التحميل');
                });
            }

        }, 300); // انتظار 300ms لضمان ظهور الرسالة أولاً
    }
    
    // معالجة إرسال النموذج
    function handleFormSubmit(e) {
        e.preventDefault();

        if (areAllQuestionsAnswered()) {
            showPathPreview();
        } else {
            alert("⚠️ يرجى الإجابة على جميع الأسئلة أولاً");
        }
    }

    // أحداث الاستماع
    prevBtn.addEventListener('click', goToPrevQuestion);
    nextBtn.addEventListener('click', goToNextQuestion);
    submitBtn.addEventListener('click', handleFormSubmit);
    editPathBtn.addEventListener('click', editAnswers);
    startPathBtn.addEventListener('click', startLearningPath);

    // الاستماع لتغيير الإجابات
    questions.forEach(question => {
        const radioInputs = question.querySelectorAll('input[type="radio"]');
        radioInputs.forEach(input => {
            input.addEventListener('change', () => {
                updateNavigationButtons();
            });
        });
    });

    // تهيئة الصفحة عند التحميل
    initPage();

    // تأثيرات إضافية
    document.querySelectorAll('.option-card').forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-3px)';
        });

        card.addEventListener('mouseleave', function () {
            if (!this.querySelector('input[type="radio"]').checked) {
                this.style.transform = 'translateY(0)';
            }
        });
    });
});