const contactInput = document.getElementById('contact-input');
if (contactInput) {
    let previousValue = '+38';
    let previousDigits = '38';
    let previousCursorPos = 3;

    function formatPhone(digits) {
        if (digits.length === 0) {
            digits = '38';
        } else if (!digits.startsWith('38')) {
            digits = '38' + digits.replace(/^38/, '').replace(/^[0-9]+/, '');
        }

        if (digits.length > 12) {
            digits = digits.substring(0, 12);
        }

        let formatted = '+38';
        if (digits.length > 2) {
            const phoneDigits = digits.substring(2);
            if (phoneDigits.length > 0) {
                formatted += ' (' + phoneDigits.substring(0, 3);
                if (phoneDigits.length > 3) {
                    formatted += ') ' + phoneDigits.substring(3, 6);
                    if (phoneDigits.length > 6) {
                        formatted += '-' + phoneDigits.substring(6, 8);
                        if (phoneDigits.length > 8) {
                            formatted += '-' + phoneDigits.substring(8, 10);
                        }
                    }
                } else {
                    formatted += ')';
                }
            }
        }

        return formatted;
    }

    contactInput.addEventListener('input', function (e) {
        let value = e.target.value;
        let cursorPos = e.target.selectionStart;

        let digits = value.replace(/\D/g, '');

        let wasAddition = digits.length > previousDigits.length;
        let wasDeletion = digits.length < previousDigits.length;

        const MAX_DIGITS = 12;
        if (digits.length > MAX_DIGITS) {
            if (wasAddition) {
                e.target.value = previousValue;
                setTimeout(function () {
                    e.target.setSelectionRange(previousCursorPos, previousCursorPos);
                }, 0);
                return;
            }
            digits = digits.substring(0, MAX_DIGITS);
        }

        let formatted = formatPhone(digits);

        let newCursorPos = 3;

        if (wasAddition) {
            let digitsBeforeCursor = value.substring(0, cursorPos).replace(/\D/g, '').length;
            if (cursorPos <= 3) {
                digitsBeforeCursor = 2;
            }

            let digitCount = 0;
            for (let i = 0; i < formatted.length; i++) {
                if (/\d/.test(formatted[i])) {
                    digitCount++;
                    if (digitCount >= digitsBeforeCursor) {
                        newCursorPos = i + 1;
                        if (newCursorPos < formatted.length && !/\d/.test(formatted[newCursorPos])) {
                            newCursorPos++;
                        }
                        break;
                    }
                }
            }
        } else if (wasDeletion) {
            let digitsBeforeCursor = previousValue.substring(0, previousCursorPos).replace(/\D/g, '').length;
            if (previousCursorPos <= 3) {
                digitsBeforeCursor = 2;
            }

            if (digitsBeforeCursor > 2) {
                digitsBeforeCursor = digitsBeforeCursor - 1;
            }

            let digitCount = 0;
            for (let i = 0; i < formatted.length; i++) {
                if (/\d/.test(formatted[i])) {
                    digitCount++;
                    if (digitCount >= digitsBeforeCursor) {
                        newCursorPos = i + 1;
                        break;
                    }
                }
            }
        } else {
            let digitsBeforeCursor = value.substring(0, cursorPos).replace(/\D/g, '').length;
            if (cursorPos <= 3) {
                digitsBeforeCursor = 2;
            }

            let digitCount = 0;
            for (let i = 0; i < formatted.length; i++) {
                if (/\d/.test(formatted[i])) {
                    digitCount++;
                    if (digitCount >= digitsBeforeCursor) {
                        newCursorPos = i + 1;
                        break;
                    }
                }
            }
        }

        if (newCursorPos < 3) {
            newCursorPos = 3;
        }

        e.target.value = formatted;

        previousValue = formatted;
        previousDigits = digits;

        setTimeout(function () {
            e.target.setSelectionRange(newCursorPos, newCursorPos);
            previousCursorPos = newCursorPos;
        }, 0);
    });

    contactInput.addEventListener('click', function (e) {
        let cursorPos = e.target.selectionStart;
        if (cursorPos < 3) {
            setTimeout(function () {
                e.target.setSelectionRange(3, 3);
                previousCursorPos = 3;
            }, 0);
        } else {
            previousCursorPos = cursorPos;
        }
    });

    contactInput.addEventListener('keydown', function (e) {
        previousCursorPos = e.target.selectionStart;

        if (e.keyCode === 8 || e.keyCode === 46) {
            let value = e.target.value;
            let cursorPos = e.target.selectionStart;
            let selectionEnd = e.target.selectionEnd;

            if (cursorPos <= 3 && cursorPos === selectionEnd) {
                e.preventDefault();
                setTimeout(function () {
                    e.target.setSelectionRange(3, 3);
                }, 0);
                return;
            }

            if (e.keyCode === 46 && cursorPos === 3 && cursorPos === selectionEnd) {
                e.preventDefault();
                return;
            }

            if (cursorPos !== selectionEnd) {
                if (cursorPos <= 3 || selectionEnd <= 3) {
                    e.preventDefault();
                    setTimeout(function () {
                        e.target.setSelectionRange(3, 3);
                    }, 0);
                    return;
                }
                return;
            }

            let digits = value.replace(/\D/g, '');
            let phoneDigits = digits.length > 2 ? digits.substring(2) : '';

            let closingBracketPos = value.indexOf(')');
            let digitsAfterBracket = '';
            if (closingBracketPos !== -1 && phoneDigits.length > 3) {
                digitsAfterBracket = phoneDigits.substring(3);
            }

            if (phoneDigits.length <= 3 && phoneDigits.length > 0 && digitsAfterBracket.length === 0) {
                if (closingBracketPos !== -1 && cursorPos >= closingBracketPos) {
                    e.preventDefault();
                    let newDigits = '38' + phoneDigits.substring(0, phoneDigits.length - 1);
                    let formatted = formatPhone(newDigits);
                    e.target.value = formatted;

                    setTimeout(function () {
                        let newPhoneDigits = newDigits.length > 2 ? newDigits.substring(2) : '';
                        let newPos = formatted.length;
                        if (newPhoneDigits.length > 0) {
                            let openBracketPos = formatted.indexOf('(');
                            if (openBracketPos !== -1) {
                                newPos = openBracketPos + 1 + newPhoneDigits.length;
                            }
                        } else {
                            newPos = 3;
                        }
                        e.target.setSelectionRange(newPos, newPos);
                    }, 0);
                    return;
                }
            }
        }
    });

    contactInput.addEventListener('keypress', function (e) {
        let value = e.target.value;
        let cursorPos = e.target.selectionStart;

        if (cursorPos < 3) {
            e.preventDefault();
            setTimeout(function () {
                e.target.setSelectionRange(3, 3);
            }, 0);
            return;
        }

        if ([8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
            (e.keyCode === 65 && e.ctrlKey === true) ||
            (e.keyCode === 67 && e.ctrlKey === true) ||
            (e.keyCode === 86 && e.ctrlKey === true) ||
            (e.keyCode === 88 && e.ctrlKey === true)) {
            return;
        }

        const MAX_DIGITS = 12;
        let digits = value.replace(/\D/g, '');
        if (digits.length >= MAX_DIGITS) {
            if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105)) {
                e.preventDefault();
                return;
            }
        }

        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });

    contactInput.addEventListener('paste', function (e) {
        e.preventDefault();
        let paste = (e.clipboardData || window.clipboardData).getData('text');
        let digits = paste.replace(/\D/g, '');
        if (digits.length > 0 && !digits.startsWith('38')) {
            digits = '38' + digits.replace(/^38/, '');
        }

        const MAX_DIGITS = 12;
        if (digits.length > MAX_DIGITS) {
            digits = digits.substring(0, MAX_DIGITS);
        }
        let formatted = formatPhone(digits);
        contactInput.value = formatted;

        previousValue = formatted;
        previousDigits = digits;

        setTimeout(function () {
            contactInput.setSelectionRange(formatted.length, formatted.length);
            previousCursorPos = formatted.length;
        }, 0);
    });
}

const form = document.querySelector('.form');
if (form) {
    form.addEventListener('submit', function (e) {
        setTimeout(function () {
        }, 100);
    });
}

if (window.location.search.includes('submitted=true')) {
    alert('Спасибо! Ваша заявка отправлена. Я свяжусь с вами в ближайшее время.');
    window.history.replaceState({}, document.title, window.location.pathname);
}