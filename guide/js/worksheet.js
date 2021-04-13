/* feWorksheet */ ;
(function ($, window, document, undefined) {
  var feWorksheet = {
    init: function (options) {
      var opt = $.extend({}, $.fn.feWorksheet.defaultOptions, options);
      // Default ajax setup
      $.ajaxSetup({
        cache: false
      });
      return this.each(function () {
        // Default
        $('title').text($('h1').text()); // Page title
        $('.' + opt.filterSectionClass).feWorksheet('_taskSetPage', opt); // Task
        $(opt.workseetEl)
          .feWorksheet('setNavi', opt) // Create navigation
          .feWorksheet('setNumber', opt) // Create number cell
          .feWorksheet('reflectDepth', opt) // Reflect depth text
          .find('td.' + opt.nameCellClass)
          .feWorksheet('_linkPath', opt); // File link path
        // Options
        if (opt.delayInfo != false) // Delay info
          $('td.' + opt.dueCellClass).feWorksheet('delayInfo', opt);
      });
    },
    // Default: Create navigation
    setNavi: function (opt) {
      var _naviCode = '<nav>' +
        '<h2>' + opt.naviTitle + '</h2>' +
        '<ul></ul>' +
        '</nav>'; // navigation code
      $('h1').after(_naviCode); // Creat nav el
      return this.each(function () {
        var $this = $(this), // workseetEl
          $navEl = $('nav'), // Navigation wrapper tag
          $menuTitEl = $this.prev('h3'), // Menu title
          thisIdx = $(opt.workseetEl).index($this) + 1; // Number for href
        $menuTitEl.attr('id', opt.naviPrefix + thisIdx); // Add id attr for bookmark
        // Creat nav items
        $navEl.find('ul')
          .append('<li><a href="#' + opt.naviPrefix +
            thisIdx + '">' + $menuTitEl.text() + '</a></li>');
      });
    },
    // Default: Create number cell
    setNumber: function (opt) {
      return this.each(function () {
        var $this = $(this), // workseetEl
          _theadCellCode = '<th scope="col" class="' +
          opt.numCellClass + '">' +
          opt.numCellText +
          '</th>'; // thead cell code
        // Create number cell
        $this
          .find('thead tr').prepend(_theadCellCode).end() // Add thead cell
          .find('tbody tr').each(function () { // Cheack table row
            var idxNum = $(this).index() + 1, // Table row index
              _tbodyCellCode = '<td class="' +
              opt.numCellClass + '">' +
              idxNum +
              '</td>'; // tbody cell code
            $(this).prepend(_tbodyCellCode); // Add tbody cell
          });
      });
    },
    // Default: Reflect depth text
    reflectDepth: function (opt) {
      return this.each(function () {
        var $this = $(this), // workseetEl
          $tbodyTrEl = $this.find('tbody tr'), // tbody row
          $depthCell = $tbodyTrEl.find('.' + opt.depthCellClass); // depthCellClass
        // Check tbody row
        $tbodyTrEl.each(function () {
          $(this).find($depthCell).each(function () { // Check depth cell
            var thisIdx = $(this).index() - 1, // index for eq selector
              reflectText = $(this).closest($tbodyTrEl).prev() // Target text
              .find($depthCell).eq(thisIdx).text();
            if ($(this).text().trim()) return false;
            $(this).text(reflectText);
          });
        });
      });
    },
    // Options: Delay info
    delayInfo: function (opt) {
      return this.each(function () {
        var $this = $(this), // dueCellClass
          dDate = $this.text(), // Due date
          // Today date default format(yyyy-mm-dd)
          tDate = new Date(),
          dFormat = /(\d{4})-(\d{2})-(\d{2})/,
          tDate = tDate.getFullYear() + '-' + (
            ((tDate.getMonth() + 1) < 10) ?
            '0' + (tDate.getMonth() + 1) : '' + (tDate.getMonth() + 1)
          ) + '-' + (
            (tDate.getDate() < 10) ?
            '0' + tDate.getDate() : '' + tDate.getDate()
          );
        // Add class
        if (dDate == '' || !dFormat.test(dDate))
          $this.addClass(opt.delayError); // Error
        else if (dDate > tDate) $this.addClass(opt.delayBefore); // Before
        else if (dDate < tDate) $this.addClass(opt.delayAfter); // After
        else if (dDate == tDate) $this.addClass(opt.delayToday); // Today
        else $this.addClass(opt.delayError); // Error
      });
    },
    // Default: Task setting(for page)
    _taskSetPage: function (opt) {
      return this.each(function () {
        var $this = $(this), // filterSectionClass
          $taskEl = $this.find('label:has(b):has(i)'), // Task list
          $_taskCell = $('td.' + opt.taskCellClass), // Task cell(total)
          $_checkBoxEl = $this.find(':checkbox'),
          taskPrefix = 'taskVal',
          defaultTask = $this.find('.default').text().trim(), // Default task
          taskKeyArray = $taskEl.map(function () {
            return $(this).find('b').text().trim();
          }).get(), // Task Key
          taskNameArray = $taskEl.map(function () {
            return $(this).find('i').text();
          }).get(), // Task Name
          _footerCode = '<footer>' +
          '<h2>' + opt.totalCountTitle + '</h2>' +
          '<table>' +
          '<caption>' + opt.totalCountCaption + '</caption>' +
          '<thead>' +
          '<tr>' +
          '<th scope="col">Menu</th>' +
          '<th scope="col">Total</th>' +
          '</tr>' +
          '</thead>' +
          '<tbody></tbody>' +
          '<tfoot><th scope="row">Total</th></tfoot>' +
          '</table>' +
          '</footer>'; // footer el code
        // Task checkbox value
        $taskEl.each(function () {
          var taskKey = $(this).find('b').text().trim();
          $(this).find(':checkbox').attr('value', taskPrefix + taskKey);
        });
        // Filter
        $_checkBoxEl.on('change', function () {
          var $_tgTableRow = $(opt.workseetEl).find('tbody > tr'); // Table row(total)
          if ($(this).val() == 'all') { // All
            if (!$(this).is(":checked")) {
              $_checkBoxEl
                .removeAttr('disabled')
                .not($(this))
                .trigger('click');
            } else {
              $_checkBoxEl.not($(this))
                .attr('disabled', 'disabled')
                .removeAttr('checked');
              $_tgTableRow.show();
            };
          } else { // Task
            var tgDataVal = $(this).val().split(taskPrefix)[1],
              $tgTableRow = $_tgTableRow
              .filter(':has([data-task="' + tgDataVal + '"])');
            (!$(this).is(":checked")) ?
            $tgTableRow.hide(): $tgTableRow.show();
          };
        }).filter('[value=all]').trigger('click');
        // Task cell(total)
        $_taskCell.each(function () {
          // Add task data attr
          ($(this).text().trim() == '' ||
            $.inArray($(this).text(), taskKeyArray) == -1) ?
          $(this).attr('data-task', defaultTask).text(defaultTask): $(this).attr('data-task', $(this).text());
          // Change task key to task name
          var thisKey = $(this).data('task').toString(),
            thisArrayIdx = $.inArray(thisKey, taskKeyArray);
          $(this).text(taskNameArray[thisArrayIdx]);
        });
        // Creat footer el
        $('.' + opt.filterSectionClass).before(_footerCode);
        $.each(taskKeyArray, function (idx, val) {
          var $footerEl = $('footer'),
            taskSum = $_taskCell
            .filter('[data-task=' + val + ']').size(), // Get size
            _footerThead = '<th scope="col">' +
            '<i>' + taskNameArray[idx] + '</i>' +
            '<b>' + val + '</b>' +
            '</th>'; // footer thead code
          $footerEl
            .find('thead th:last') // Add footer thead
            .before(_footerThead).end()
            .find('tfoot tr') // Add footer tfoot
            .append('<td>' + taskSum + '</td>');
        });
        // Total count in footer tfoot
        $('footer').find('tfoot tr')
          .append('<td>' +
            $('td.' + opt.taskCellClass).size() +
            '</td>');
        // Call table setting
        $(opt.workseetEl)
          .feWorksheet('_taskSetTable', opt, taskKeyArray, taskNameArray);
      });
    },
    // Default: Task setting(for table)
    _taskSetTable: function (opt, taskKeyArray, taskNameArray) {
      return this.each(function () {
        var $this = $(this), // workseetEl
          $footerEl = $('footer'),
          $taskCell = $this.find('td.' + opt.taskCellClass), // taskCellClass
          colSpanSize = $this.find('thead th').size(),
          totalSize = $this.find('tbody > tr').size(), // table row size
          menuTitle = $this.prev('h3').text(), // Menu title
          tableIdx = $(opt.workseetEl).index($this), // Table index
          _totalCode = '<tr>' +
          '<th scope="row" colspan="' + colSpanSize + '">' +
          'Total' +
          '</th>' +
          '<td>' + totalSize + '</td>' +
          '</tr>', // total code
          _footerTbodyCode = '<tr>' +
          '<th scope="row">' + menuTitle + '</th>' +
          '</tr>'; // tbody code in footer el
        $footerEl
          .find('tbody').append(_footerTbodyCode); // Add menu in footer tbody
        $this.append('<tfoot />'); // Create tfoot el
        $.each(taskKeyArray, function (idx, val) {
          var tgTaskSize = $taskCell
            .filter('[data-task=' + val + ']').size(), // Get task size
            _footerCode = '<td>' + tgTaskSize + '</td>', // tbody td code in footer el
            _tfootCode = '<tr>' +
            '<th scope="row" colspan="' + colSpanSize + '">' +
            '<i>' + taskNameArray[idx] + '</i>' +
            '<b>' + val + '</b>' +
            '</th>' +
            '<td>' + tgTaskSize + '</td>' +
            '</tr>'; // tfoot tr code
          $footerEl // Add tbody td in footer
            .find('tbody tr:eq(' + tableIdx + ')')
            .append(_footerCode);
          $this.find('tfoot').append(_tfootCode); // Add task count in tfoot
        });
        $footerEl // Add total count in footer tbody
          .find('tbody tr:eq(' + tableIdx + ')')
          .append('<td>' + totalSize + '</td>');
        $this.find('tfoot').append(_totalCode); // Add total count in tfoot
      });
    },
    // Default: File link path
    _linkPath: function (opt) {
      return this.each(function () {
        var $this = $(this), // nameCellClass
          thisTxt = $this.text(),
          defaultPath = $this.closest(opt.workseetEl)
          .find('caption').text().trim(), // caption el text
          folderPath = $this.siblings('.' + opt.pathCellClass)
          .text().trim(), // pathCellClass
          newPath;
        // Check empty cell, has anchor
        if (!thisTxt || $this.has('a').size() != 0) return;
        // Create anchor with target link
        (!folderPath) ?
        newPath = defaultPath + '/' + thisTxt: newPath = defaultPath + '/' + folderPath + '/' + thisTxt;
        $this.html('<a target="_blank" href="' + newPath + '">' + thisTxt + '</a>');
      });
    }
  };
  $.fn.feWorksheet = function (method) {
    var arguments;
    (feWorksheet[method]) ?
    arguments = feWorksheet[method]
      .apply(this, Array.prototype.slice.call(arguments, 1)): arguments = feWorksheet.init
      .apply(this, arguments);
    return arguments;
  };
  $.fn.feWorksheet.defaultOptions = {
    // Default elements
    workseetEl: 'table:not(footer table)', // Worksheet table el
    filterSectionClass: 'filterWrap', // Filter section class
    // Default worksheet cell class
    numCellClass: 'pageNumber', // Number cell class
    depthCellClass: 'menuDepth', // Depth
    pathCellClass: 'filePath', // File path
    nameCellClass: 'fileName', // File name
    dueCellClass: 'dueDate', // Due date
    delayBefore: 'delayBefore', // Delay: Before
    delayAfter: 'delayAfter', // Delay: After
    delayToday: 'delayToday', // Delay: Today
    delayError: 'delayError', // Delay: Error
    taskCellClass: 'checkTask', // Task
    // Options
    naviTitle: 'Navigation', // Navigation title
    naviPrefix: 'menuIdx', // Navigation prefix
    totalCountTitle: 'Total Count', // Total count title
    totalCountCaption: 'Task total count', // Total count caption
    numCellText: 'Number', // Number cell title
    delayInfo: true // Delay info
  };
})(jQuery, window, document);
/* //feWorksheet */