// একটি ডেটা সেটের গড় (Mean) গণনা
function calculateMean(data) {
    if (data.length === 0) return 0;
    const sum = data.reduce((a, b) => a + b, 0);
    return sum / data.length;
}

// একটি ডেটা সেটের ভেদাঙ্ক (Variance) গণনা
function calculateVariance(data, mean) {
    if (data.length === 0) return 0;
    const squaredDifferences = data.map(x => Math.pow(x - mean, 2));
    const sumSquaredDiff = squaredDifferences.reduce((a, b) => a + b, 0);
    // নমুনা ভেদাঙ্ক (Sample Variance) এর জন্য (n-1) দ্বারা ভাগ
    return sumSquaredDiff / (data.length - 1); 
}

// একটি ডেটা সেটের সম্যক বিচ্যুতি (Standard Deviation) গণনা
function calculateStdDev(variance) {
    return Math.sqrt(variance);
}

// দুটি ডেটা সেটের সহ-ভেদাঙ্ক (Covariance) গণনা
function calculateCovariance(xData, yData, meanX, meanY) {
    if (xData.length !== yData.length || xData.length === 0) return 0;
    
    let sumOfProducts = 0;
    for (let i = 0; i < xData.length; i++) {
        sumOfProducts += (xData[i] - meanX) * (yData[i] - meanY);
    }
    // নমুনা সহ-ভেদাঙ্ক (Sample Covariance) এর জন্য (n-1) দ্বারা ভাগ
    return sumOfProducts / (xData.length - 1); 
}

// দুটি ডেটা সেটের সহ-সম্পর্ক গুণাঙ্ক (Correlation Coefficient) গণনা
function calculateCorrelation(covariance, stdDevX, stdDevY) {
    if (stdDevX === 0 || stdDevY === 0) return 0;
    return covariance / (stdDevX * stdDevY);
}

// সহ-সম্পর্ক গুণাঙ্ক (CC) অনুযায়ী সম্পর্কের শক্তি নির্ধারণ
function getRelationStrength(cc) {
    const absCC = Math.abs(cc);
    let strength = '';
    let className = '';

    if (absCC >= 0.9) {
        strength = 'খুব শক্তিশালী (Perfect/Very Strong)';
        className = 'status-perfect';
    } else if (absCC >= 0.7) {
        strength = 'শক্তিশালী (Strong)';
        className = 'status-strong';
    } else if (absCC >= 0.4) {
        strength = 'মাঝারি (Intermediate)';
        className = 'status-intermediate';
    } else if (absCC > 0) {
        strength = 'দুর্বল (Weak)';
        className = 'status-weak';
    } else {
        strength = 'সম্পর্ক নেই (No Relation)';
        className = 'status-weak'; 
    }

    if (cc > 0) {
        strength = 'ধনাত্মক ' + strength; // Positive
    } else if (cc < 0) {
        strength = 'ঋণাত্মক ' + strength; // Negative
    }

    return { strength, className };
}

// প্রধান ফাংশন যা সব গণনা করে এবং আউটপুট প্রদর্শন করে
function calculateStatistics() {
    // ইনপুট থেকে ডেটা গ্রহণ এবং সংখ্যায় রূপান্তর
    const xInput = document.getElementById('xData').value;
    const yInput = document.getElementById('yData').value;

    const xData = xInput.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
    const yData = yInput.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));

    // ডেটা সংখ্যা সমান না হলে সতর্ক করা
    if (xData.length === 0 || yData.length === 0 || xData.length !== yData.length) {
        alert('দয়া করে X এবং Y ভেরিয়েবলের জন্য সমান সংখ্যক সংখ্যা কমা (,) দ্বারা আলাদা করে ইনপুট করুন।');
        return;
    }

    // --- X ভেরিয়েবলের গণনা ---
    const meanX = calculateMean(xData);
    const varianceX = calculateVariance(xData, meanX);
    const stdDevX = calculateStdDev(varianceX);

    // --- Y ভেরিয়েবলের গণনা ---
    const meanY = calculateMean(yData);
    const varianceY = calculateVariance(yData, meanY);
    const stdDevY = calculateStdDev(varianceY);

    // --- সম্পর্কীয় গণনা ---
    const covariance = calculateCovariance(xData, yData, meanX, meanY);
    const correlation = calculateCorrelation(covariance, stdDevX, stdDevY);
    const { strength, className } = getRelationStrength(correlation);

    // --- আউটপুট দেখানো ---
    
    // ফাংশন যা ফলাফলকে আউটপুটে দেখায়
    function updateOutput(id, value, decimals = 4) {
        document.getElementById(id).textContent = value.toFixed(decimals);
    }

    // X ভেরিয়েবলের ফলাফল
    updateOutput('meanX', meanX);
    updateOutput('varianceX', varianceX);
    updateOutput('stdDevX', stdDevX);

    // Y ভেরিয়েবলের ফলাফল
    updateOutput('meanY', meanY);
    updateOutput('varianceY', varianceY);
    updateOutput('stdDevY', stdDevY);
    
    // সম্পর্কীয় ফলাফল
    updateOutput('covariance', covariance);
    updateOutput('correlation', correlation);

    // সম্পর্কের শক্তির মাত্রা (ক্লাস ও টেক্সট সহ)
    const strengthElement = document.getElementById('strength');
    strengthElement.textContent = strength;
    strengthElement.className = `status-label ${className}`; // নতুন ক্লাস যুক্ত করা

}