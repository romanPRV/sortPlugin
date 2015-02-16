//Ascending order supports by default. You may set 'desc' as parameter for descending order.

(function($) {
    'use strict';
    $.fn.sortPlugin = function(order) {

        function sortTable(currTable, rows, index, order) {
            rows.sort(function(a, b) {
                a = $(a).children('td:nth-child(' + index + ')').text();
                b = $(b).children('td:nth-child(' + index + ')').text();
                if ($.isNumeric(a)) {
                    a = parseFloat(a);
                    b = parseFloat(b);
                }
                var orderFlag;
                if (order === 'desc') {
                    orderFlag = -1;
                } else {
                    orderFlag = 1;
                }
                if (a > b) {
                    return orderFlag;
                }
                if (a < b) {
                    return -orderFlag;
                }
            });
            rows.appendTo(currTable.children('tbody'));
        }

        function deepCopy(origin) {
            var copy = {};
            var type = {}.toString.call(origin).slice(8,-1);
            if (type === 'Array' || type === 'Object') {
                for (var key in origin) {
                    if (origin.hasOwnProperty(key)) {
                        copy[key] = deepCopy(origin[key]);
                    }
                }
            } else {
                copy = origin;
            }
            return copy;
        }

        return this.each(function() {
            var currTable = $(this);
            currTable.data('pushedButtons', {});
            currTable.data('prevIndexes', []);
            currTable.data('initialTable', {});

            currTable.find($('tr th')).each(function() {

                $(this).on('click', function() {
                    var index = currTable.find($('tr th')).index($(this)) + 1;
                    var original = currTable.find($('tr:not(:first-child)'));
                    var oldText;
                    var arrow;

                    if (order === 'desc') {
                        arrow = '▴';
                    } else {
                        arrow = '▾';
                    }

                    original.detach();

                    if (!currTable.data('prevIndexes')[0]) {

                        currTable.data('initialTable', deepCopy(original));
                        oldText = $(this).text();
                        $(this).css('background-color', '#d8d8d8').text(arrow + ' ' + oldText);
                        currTable.data('pushedButtons')[$(this).text()] = true;
                        sortTable(currTable, original, index, order);
                        currTable.data('prevIndexes').push(index);

                    } else {

                        var prevIndexes = currTable.data('prevIndexes');
                        var isActive = true;
                        if (currTable.data('pushedButtons')[$(this).text()]) {

                            currTable.data('pushedButtons')[$(this).text()] = false;
                            oldText = $(this).text();
                            $(this).css('background-color', 'transparent').text(oldText.substr(2));
                            prevIndexes.splice(prevIndexes.indexOf(index), 1);

                            if (!(index = prevIndexes.pop())) {
                                var qqq = currTable.data('initialTable');
                                isActive = false;
                                $(currTable.data('initialTable')).appendTo(currTable.children('tbody'));
                            }
                        } else {
                            oldText = $(this).text();
                            $(this).css('background-color', '#d8d8d8').text(arrow + ' ' + oldText);
                            currTable.data('pushedButtons')[$(this).text()] = true;
                        }

                        if (isActive) {
                            var prevEnd = 0;
                            var currValues = [];
                            var prevValues = [];
                            original.each(function(i) {
                                if (i === 0) {
                                    for (var j = 0; j < prevIndexes.length; j++) {
                                        currValues[j] = $(this).children('td:nth-child(' + prevIndexes[j] + ')').text();
                                    }
                                } else {
                                    for (j = 0; j < prevIndexes.length; j++) {
                                        prevValues[j] = currValues[j];
                                        currValues[j] = $(this).children('td:nth-child(' + prevIndexes[j] + ')').text();
                                    }
                                    var flag = true;
                                    for (j = 0; j < prevIndexes.length; j++) {
                                        if (prevValues[j] !== currValues[j]) {
                                            flag = false;
                                        }
                                    }
                                    if (!flag) {
                                        sortTable(currTable, original.slice(prevEnd, i), index, order);
                                        prevEnd = i;
                                    }
                                    if (i === original.length - 1) {
                                        sortTable(currTable, original.slice(prevEnd, i + 1), index, order);
                                    }
                                }
                            });
                            currTable.data('prevIndexes').push(index);
                        }
                    }
                });
            });
        });
    };
})(jQuery);