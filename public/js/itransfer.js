

$(function () {
    'user strict'

    /**  GLOBAL VARIABLE **/
    // array used to store all the existing document reference on the FTP server.
    $.refDocUsed = [];
    BaseURL = 'http://172.20.20.64:8018/';

    /****************************************************
     *
     * MENU
     * */

    function menu(data) {
        var tree = [] ;
        var cat = [];
        // BUILD TREE
        $.each(data, function (i, item) {

            if ( $.inArray( item.noCategory, cat ) > -1 ) {
                //category already exists
                //add document
                if( $.inArray( item.refDoc, $.refDocUsed ) > -1 ) {
                    tree[(tree.length - 1)]
                        .children[(tree[(tree.length - 1)].children.length)] = {
                        "text" :  item.refDoc + " - " +item.labelDoc_f,
                        "li_attr": {"class": "leaf"}
                    }
                }

            }else{
                //create category
                cat[cat.length] = item.noCategory;
                if( $.inArray( item.refDoc, $.refDocUsed ) > -1 ) {
                    tree[tree.length] =
                    {
                        "id"    : item.noCategory,
                        "text"  : item.noCategory + " - " + item.labelCategory_f,
                        "children": [{ //add document
                            "text" : item.refDoc + " - " + item.labelDoc_f,
                            "li_attr": {"class": "leaf"}
                        }]
                    };
                }/*else{
                 tree[tree.length] =
                 {
                 "id"    : item.noCategory,
                 "text"  : item.noCategory + " - " + item.labelCategory_f,
                 "children": []
                 };
                 }*/
            }

        });

        // JSTREE
        $('#sidenav')
            .on('select_node.jstree', function (e, data) {
                data.instance.toggle_node(data.node);
                //apply filter
            })
            .jstree({
                'core': {
                    'data': {
                        "text": "Tous les documents",
                        "state": {
                            "opened": true,
                            "disabled": false,
                            "selected": true
                        },
                        "children": tree
                    } //TODO: add documents internes...
                }
            }
        );
    }

    function loadMenu (){
        //Sort used reference document
        $.refDocUsed.sort(function(a, b){return a-b});
        $.ajax({
            type: 'GET',
            url: BaseURL + 'category/',
            success: menu
        });
        //TODO: create the tree THEN add nodes dynamically!!!
        //override();
    }

    /****************************************************
     *
     * TABLE
     * */

    $.extend(true, $.fn.bootstrapTable.prototype, {initHeader : function () {
        var that = this,
            visibleColumns = [],
            html = [];

        this.header = {
            fields: [],
            styles: [],
            formatters: [],
            events: [],
            sorters: []
        };
        $.each(this.options.columns, function (i, column) {
            var text = '',
                style = sprintf('text-align: %s; ', column.align) +
                    sprintf('vertical-align: %s; ', column.valign),
                order = that.options.sortOrder || column.order;

            if (!column.visible) {
                return;
            }

            visibleColumns.push(column);
            that.header.fields.push(column.field);
            that.header.styles.push(style);
            that.header.formatters.push(column.formatter);
            that.header.events.push(column.events);
            that.header.sorters.push(column.sorter);

            if (column.halign) {
                style = sprintf('text-align: %s; ', column.halign) +
                    sprintf('vertical-align: %s; ', column.valign);
            }
            style += sprintf('width: %spx; ', column.checkbox || column.radio ? 36 : column.width);
            style += that.options.sortable && column.sortable ? 'cursor: pointer; ' : '';

            html.push('<th',
                    column.checkbox || column.radio ? ' class="bs-checkbox"' :
                    sprintf(' class="%s"', column['class']),
                sprintf(' style="%s"', style),
                '>');
            html.push('<div class="th-inner">');

            text = column.title;
            if (that.options.sortName === column.field && that.options.sortable && column.sortable) {
                text += that.getCaretHtml();
            }

            if (column.checkbox) {
                if (!that.options.singleSelect && that.options.checkboxHeader) {
                    text = '<input name="btSelectAll" type="checkbox" />';
                }
                that.header.stateField = column.field;
            }
            if (column.radio) {
                text = '';
                that.header.stateField = column.field;
                that.options.singleSelect = true;
            }

            html.push(text);
            html.push('</div>');
            html.push('<div class="fht-cell"></div>');
            html.push('</th>');
        });

        this.$header.find('tr').html(html.join(''));
        this.$header.find('th').each(function (i) {
            $(this).data(visibleColumns[i]);

            if (that.options.sortable && visibleColumns[i].sortable) {
                $(this).off('click').on('click', $.proxy(that.onSort, that));
                //console.log("this", this);
                $('#sortDL').on('click', $.proxy(that.onSortDownload, that));
                $(this).find('div').eq(0).append('&nbsp;<i class="fa fa-sort"></i>');
            }
        });

        if (!this.options.showHeader || this.options.cardView) {
            this.$header.hide();
            this.$container.find('.fixed-table-header').hide();
            this.$loading.css('top', 0);
        } else {
            this.$header.show();
            this.$container.find('.fixed-table-header').show();
            this.$loading.css('top', '42px');
        }

        this.$selectAll = this.$header.find('[name="btSelectAll"]');
        this.$selectAll.off('click').on('click', function () {
            var checked = $(this).prop('checked');
            that[checked ? 'checkAll' : 'uncheckAll']();
        });
    }});


    $.extend(true, $.fn.bootstrapTable.prototype.onSortDownload = function (event) {
        var $this = $(event.currentTarget),
            $this_ = this.$header.find('th').eq(0);

        this.$header.add(this.$header_).find('span.order').remove();
        this.options.sortName = "notDownloaded";
        this.options.sortOrder = $this.data('order') === 'asc' ? 'desc' : 'asc';

        this.trigger('sort', this.options.sortName, this.options.sortOrder);

        $this.add($this_).data('order', this.options.sortOrder)
            .find('.th-inner').append(this.getCaretHtml());

        if (this.options.sidePagination === 'server') {
            this.initServer();
            return;
        }
        this.initSort();
        this.initBody();
    });

    // Styling the row if the file is new
    function rowStylef(row, i, filter) {
        if (row.isNew) return {"classes": "isNew" };
        else return {};
    }

    //TODO replace url with dynamic!!!!
    $('#mainTable').bootstrapTable({
        method: 'get',
        url: BaseURL + 'file/'+ sessionStorage.getItem('token') +'/',
        striped: true,
        pagination: true,
        pageSize: 20,
        pageList: [10, 20, 50, 100],
        search: true,
        showColumns: true,
        showRefresh: true,
        minimumCountColumns: 5,
        rowStyle: rowStylef,
        onLoadSuccess: loadMenu,
        columns: [
            {
                field: 'state',
                checkbox: false,
                visible: false
            },
            {
                field: 'notDownloaded',
                title: 'DL',
                sortable: true,
                formatter: function (value, row) {
                    if (value) {
                        var dlCount = row.downloadCount ? row.downloadCount : '';
                        return "<a class='dl' data-id='" + row.idFile + "' " +
                            "data-file='" + row.fileName + "' href='#'><i class='fa fa-download text-primary'></i><small class='text-muted'>&nbsp;" + dlCount + "</small></a>";
                    } else {
                        var dlCount = row.downloadCount ? row.downloadCount : '';
                        return "<a class='dl' data-id='" + row.idFile + "' " +
                            "data-file='" + row.fileName + "' href='#'><i class='fa fa-download text-muted'></i><small class='text-muted'>&nbsp;" + dlCount + "</small></a>";
                    }
                }
            },
            {
                field: 'isNew',
                title: 'New',
                sortable: true,
                visible: false,
                formatter: function (value) {
                    if (value) return "<i class='fa fa-smile-o'></i>"
                    else return "<i class='fa fa-times'></i>";
                }
            },
            {
                field: 'idFile',
                title: 'File ID',
                align: 'right',
                valign: 'bottom',
                visible: false,
                sortable: true
            },
            {
                field: 'filename',
                title: 'Name',
                align: 'center',
                valign: 'middle',
                visible: false,
                sortable: true
            },
            {
                field: 'path',
                title: 'Path',
                align: 'center',
                valign: 'middle',
                visible: false,
                sortable: true
            },
            {
                field: 'size',
                title: 'Size',
                align: 'center',
                valign: 'middle',
                visible: false,
                sortable: true
            },
            {
                field: 'libelle',
                title: 'Libell&eacute;',
                align: 'left',
                valign: 'middle',
                sortable: true,
                formatter: function (value) {
                    if (!value || value == '') return 'x';
                    else return value;
                }
            },
            {
                field: 'refDoc',
                title: 'Ref Document',
                align: 'center',
                valign: 'middle',
                sortable: true,
                formatter: function (value) {
                    if (!value || value == '') return 'x';
                    else {
                        var val = parseInt(value);
                        if ($.inArray( val, $.refDocUsed ) < 0){
                            $.refDocUsed[$.refDocUsed.length] = val;
                        }
                        return val;
                    }
                }
            },
            {
                field: 'noEmployeur',
                title: 'Employeur',
                align: 'center',
                valign: 'middle',
                sortable: true,
                formatter: function (value) {
                    if (!value || value == '') return 'x';
                    else return value;
                }
            },
            {
                field: 'refClientCompl',
                title: 'Ref Client',
                align: 'center',
                valign: 'middle',
                sortable: true,
                formatter: function (value) {
                    if (!value || value == '') return 'x';
                    else return value;
                }
            },
            {
                field: 'counter',
                title: '#',
                align: 'center',
                valign: 'middle',
                visible: false,
                sortable: true,
                formatter: function (value) {
                    if (!value || value == '') return 'x';
                    else return value;
                }
            },
            {
                field: 'date',
                title: 'Date',
                align: 'center',
                valign: 'middle',
                sortable: true,
                formatter: function (value) {
                    if (!value || value == '') return 'x';
                    else return value;
                }
            },
            {
                field: 'refGroups',
                title: 'Ref Group S',
                align: 'center',
                valign: 'middle',
                sortable: true,
                formatter: function (value) {
                    if (!value || value == '') return 'x';
                    else return value;
                }
            },
            {
                field: 'extension',
                title: 'ext',
                align: 'center',
                valign: 'middle',
                sortable: true,
                formatter: function (value) {
                    if (!value || value == '') return 'x';
                    else return value;
                }
            }
        ]
    });


});


