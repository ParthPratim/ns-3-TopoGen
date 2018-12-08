CIRCLE_SHAPE = "circle"
RECT_SHAPE = "rect"
NEW_MODEL_LAYER = 1
NEW_FUNCT_LAYER = 2
var components = []
var component_element = {}
var module_map = null
var builtin_map = null
var map_connector = []
var line_connectors = []
function cmp(str1, str2) {
    if (str1.localeCompare(str2) == 0) {
        return true
    }
    return false
}
$(document).ready(function () {
    var h1 = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
    var h2 = $("#top-navbar").innerHeight()
    var h3 = $("#icon-tray").innerHeight()
    var h4 = $("#details-opt").innerHeight() + $("#layers-opt").innerHeight()
    var h = h1 - (h2 + h3 + 35)
    var x = 60, y = 20
    $('#scratchpad').height(h);
    $('#model-desc').height(h - (h4 + 10));
    var compo_index = 0;
    var two = new Two({ width: $('#scratchpad').width(), height: $('#scratchpad').height() }).appendTo(document.getElementById('scratchpad'));

    components.push({
        "model_type": "builtin__elements",
        "model": "data_type",
        "varname": "argc",
        "type": "int"
    })
    components.push({
        "model_type": "builtin__elements",
        "model": "data_type",
        "varname": "argv",
        "type": "char* []"
    })
    registerAllWindowTemplates()
    $.ajax({
        url: "http://localhost:2018/topocreator/fetch-model-maps",
        success: function (json_data) {
            opt_wind = $('#model-desc .layer-wind')
            opt_wind.html("")
            var index = 1
            module_map = json_data
            $.each(json_data, function (model, class_data) {

                markup = '<div class="layer-item" id="mod' + index + '-list">\
            <div class="layer-item-desc"  data-toggle="collapse" data-target="#mod'+ index + '-class-list">\
            <img class="layer-item-icon" src="/static/icons/model.png">\
            <span class="layer-item-text">'

                markup += model + '</span><div class="modellist-class collapse" id="mod' + index + '-class-list"  data-parent="#mod' + index + '-list">'

                $.each(class_data, function () {

                    class_name = this["__Model__Configuration__"]["disp"]

                    markup += '<div class="layer-item model-item" style="margin-left: 7px;cursor:pointer" class-target="' +
                        model + '/' + this["__Model__Configuration__"]["model"] + '">\
                    <img class="layer-item-icon" src="/static/icons/class.png">\
                    <span class="layer-item-text">'+ class_name + '</span></div>'


                })
                markup += "</div></div></div>"
            })

            $(opt_wind).append($(markup))
            index++

            $('#model-desc .model-item').click(loadModel)
        },
        dataType: "json"
    });
    $.ajax({
        url: "http://localhost:2018/topocreator/fetch-builtins",
        success: function (data) {
            builtin_map = data
        },
        dataType: "json"
    })

    function createComponent(shape, color_code, componame, varname, category) {
        //circle 
        var group = null;
        if (cmp(shape, CIRCLE_SHAPE)) {
            abbr = ""
            $.each(componame.split(' '), function () {
                abbr += this[0]
            })
            rect_width = abbr.length * 10
            circle = two.makeCircle(x + 15, y + 15, rect_width / 2)
            circle.fill = color_code
            circle.stroke = "#404040"
            text = two.makeText(abbr, x + 15, y + 17)
            text.fill = "#fff"
            orect = two.makeRectangle(x + 15, y + 15, rect_width + 20, 35)
            orect.fill = "transparent"
            orect.stroke = "#000"
            x += 5
            y += 30
            group = two.makeGroup(circle, text, orect)
        }
        else if (cmp(shape, RECT_SHAPE)) {
            rect_width = componame.length * 10
            rect = two.makeRectangle(x + 5, y, rect_width, 20)
            rect.fill = color_code
            rect.stroke = "#404040"
            text = two.makeText(componame, x + 5, y + 2)
            text.fill = "#fff"
            orect = two.makeRectangle(x + 5, y, rect_width + 20, 35)
            orect.fill = "transparent"
            orect.stroke = "transparent"
            x += 50
            y += 20
            group = two.makeGroup(rect, text, orect)
        }

        two.update()

        addActionLayer(NEW_MODEL_LAYER, varname, componame)

        addTitleToGroup(group._renderer.elem, componame)

        $('#scratchpad').on('mousemove', function (e) {

            $description.css({
                left: e.pageX - $('#scratchpad').position().left,
                top: (e.pageY - $('#scratchpad').position().top) + 30
            });

        });
        $(group._renderer.elem).mousedown(function (e) {
            makeElementDraggable(e, group)
        }).click(function (evt) {
            evt.preventDefault()
            position = group.getBoundingClientRect()
            $.each(component_element, function (varname, prop) {
                prop.svg_element.children[2].stroke = "transparent"
            })
            group.children[2].stroke = "#000"
            two.update()
            group_ren_elem = $(this)
            $('#model-toolbox').css('visibility', 'visible');
            $('#model-toolbox .invoke-method').off('click').click(function (evt) {
                evt.preventDefault()
                win_config = {
                    "attach_callback": true,
                    "callback": function (method) {
                        prepare_invoke = {
                            "attach_callback": true,
                            "callback": function (call_config) {
                                // ADD ACTION LAYER FOR FUNCTION
                                xcomponame = call_config.method
                                var groupx = null
                                abbr = ""
                                $.each(xcomponame.split(' '), function () {
                                    abbr += this[0]
                                })
                                rect_width = abbr.length * 10
                                position = $(group_ren_elem.context.children[2]).position()
                                position.left -= $('#scratchpad').position().left
                                position.top -= $('#scratchpad').position().top
                                circle = two.makeCircle(position.left + 10, position.top + 10, rect_width / 2 + 5)
                                circle.fill = color_code
                                circle.stroke = "#404040"
                                text = two.makeText(abbr, position.left + 10, position.top + 12)
                                text.fill = "#fff"
                                orect = two.makeRectangle(position.left + 15, position.top + 15, rect_width + 20, 35)
                                orect.fill = "transparent"
                                orect.stroke = "transparent"
                                groupx = two.makeGroup(circle, text, orect)
                                two.update()
                                addActionLayer(NEW_FUNCT_LAYER, varname, xcomponame)
                                addTitleToGroup(groupx._renderer.elem, xcomponame)
                                $.each(components, function () {
                                    if (cmp(this.varname, varname)) {
                                        this.methodcalls.push({
                                            "method": call_config.method,
                                            "args": call_config.callargs
                                        })
                                    }
                                })
                                $(groupx._renderer.elem).mousedown(function (e) {
                                    makeElementDraggable(e, groupx)
                                })
                                map_connector.push({ from: groupx.id, to: group_ren_elem.context.children[0] })
                                updateLineConnectors()
                            },
                            "args": {
                                "method": method
                            }
                        }

                        WindowTemplate(INVOKE_PARAMS_WINDOW, prepare_invoke)
                    },
                    "args": {
                        "model": components[component_element[varname].compo_index].model,
                        "varname": varname,
                        "category": category
                    }
                }
                WindowTemplate(FUNCTION_LIST_WINDOW, win_config)
            })
            loadInstanceDetails(varname)
        })

        return group
    }

    function makeElementDraggable(e, group) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;

        document.onmouseup = released_mouse
        function released_mouse(e) {
            document.onmouseup = null;
            document.onmousemove = null;
        }
        document.onmousemove = mouse_move

        function mouse_move(e) {
            $('#scratchpad #model-toolbox').css('visibility', 'hidden');
            elmnt = $(group._renderer.elem)
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            group.translation.x -= pos1
            group.translation.y -= pos2
            two.update()
            updateLineConnectors()
        }
    }
    function updateLineConnectors() {
        $.each(line_connectors, function () {
            this.remove()
        })
        line_connectors = []
        $.each(map_connector, function () {
            from = this.from
            to = this.to
            p1 = $('#' + from)[0].getBoundingClientRect()
            p2 = $(to)[0].getBoundingClientRect()
            console.log(p1)
            console.log(p2)
            sp = $('#scratchpad').offset()
            console.log(sp)
            x1 = Math.abs(p1.x + p1.width / 2 - sp.left)
            y1 = Math.abs(p1.y - 15 - sp.top + $(document).scrollTop())
            x2 = Math.abs(p2.x + p2.width / 2 - sp.left)
            y2 = Math.abs(p2.y + 3 - sp.top + $(document).scrollTop())
            x1 -= 5
            y1 -= 10
            y2 -= 20
            line = two.makeLine(x1, y1, x2, y2)
            line.stroke = "red"
            two.update()
            line_connectors.push(line)
            //ADD CONNECTOR 
        })
    }

    function loadModel() {
        target = $(this).attr("class-target").split('/')
        category = target[0]
        model = target[1]

        $.each(module_map[category], function () {
            definition = this["__Model__Configuration__"]
            if (definition["model"].localeCompare(model) == 0) {
                // FOUND MODEL
                shape = definition["styles"]["shape"]
                color = definition["styles"]["color_code"]
                disp = definition["disp"]
                varname = "nst_temp" + compo_index
                svg_element = createComponent(shape, color, disp, varname, category)
                components.push({
                    "model_type": category,
                    "model": model,
                    "varname": varname,
                    "type": definition["model"],
                    "method_calls" : []
                })

                component_element[varname] = { "compo_index": components.length - 1, "svg_element": svg_element };
                compo_index++;
            }
        })
    }

    function loadInstanceDetails(varname) {
        details = component_element[varname]
        toolbox = $('#model-toolbox')
        toolbox.find('input[name=varname]').val(varname)
    }

    function addActionLayer(type, varname, componame, ) {
        img_icon = ""
        switch (type) {
            case NEW_MODEL_LAYER: {
                img_icon = "/static/icons/layer.png";
                break;
            }
            case NEW_FUNCT_LAYER: {
                img_icon = "/static/icons/func.png";
                break;
            }
        }
        markup = '<div class="layer-item">\
            <img class="layer-item-icon" src="'+ img_icon + '">\
            <span class="layer-item-text">'+ varname + " - " + componame +
            '</span>\
            </div>'
        $('#layers-opt .layer-wind').append($(markup))
    }
    //createComponent(RECT_SHAPE,"Command Line")
    //createComponent(RECT_SHAPE,"Command Line 2")
})


function addTitleToGroup(element, summary_text) {
    $($(element).context.children[2]).attr({ 'class': 'svg-compo-tooltip' })
    $($(element).context.children[2]).attr({ 'title': summary_text })

    $description = $(".svg-tooltip");
    $('.svg-compo-tooltip').hover(function () {
        $(this).attr("class", "svg-compo-tooltip heyo");
        $description.addClass('active');
        $description.html($(this).attr('title'));
    }, function () {
        $description.removeClass('active');
    });
}