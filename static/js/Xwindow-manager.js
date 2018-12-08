MINIMIZE_WINDOW = 1
CLOSE_WINDOW = 2
WIN_INDEX = 0
MINIMIZED_WINDOWS = {}
FUNCTION_LIST_WINDOW = "0001"
INVOKE_PARAMS_WINDOW = "0002"
window_templates = {}

function initXWindow(winname,wintitle,winelem,config) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    console.log("init")
    winelem($('body'),config,winname,wintitle)
    elmnt = $('#'+winname)
    MINIMIZED_WINDOWS[winname] = wintitle

    $('#'+winname).click(function(){
        keys = Object.keys(MINIMIZED_WINDOWS)
        len = keys.length
        class_name = $(this).attr('id')
        inc = len-1;
        for(index = len-1 ; index >= 0 ; index-- ){
            i_class_n = keys[index]
            if(!i_class_n.localeCompare(class_name) == 0){
                $('#'+i_class_n).css({'z-index':inc});
                inc--;
            }
        }
        $(this).css('z-index',len)
        $(this).addClass("Xactive")
    })

    elmnt.find('.Xicon.imin').click(function(){
        MINIMIZED_WINDOWS[winname] = wintitle
        reRenderWindowPane()
        elmnt.hide()
    })
    elmnt.find('.Xicon.iclose').click(function(){
        delete MINIMIZED_WINDOWS[winname]
        $('#'+winname).hide()
        reRenderWindowPane()
    })

    $('#'+winname+' .Xtitle').mousedown(dragMouseDown)
    

    function dragMouseDown(e) {
        elmnt = $('#'+winname)
        if(!elmnt.hasClass()){
            elmnt.addClass("Xactive")
        }
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        elmnt = $('#'+winname)
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        elmnt.css({ top: (elmnt.offset().top - pos2) + "px", left: (elmnt.offset().left - pos1) + "px" })
    }
    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }

}

function closeWindow(win_name){
    delete MINIMIZED_WINDOWS[win_name]
    $('#'+win_name).hide()
    reRenderWindowPane()
}

function reRenderWindowPane(){
    $('.Xwinpane').html("")
    for(var key in MINIMIZED_WINDOWS){
        markup = $('<div class="Xwinex" target="#'+key+'">'+MINIMIZED_WINDOWS[key]+'</div>')
        $('.Xwinpane').append(markup)
        markup.click(function(){
            $($.trim($(this).attr("target"))).show()
        })
    }
}

function createXwindow(window_title,window_def,config){
    
    window_name = "topowin_"+WIN_INDEX
    initXWindow(window_name,window_title,window_def,config)
    WIN_INDEX++;
    return window_name
}

function WindowTemplate(type,win_config){
    window_def = window_templates[type](win_config)
    return createXwindow(window_def.title,window_def.renderer,win_config)
}

function register_template(typeid,func){
    window_templates[typeid] = func
}

function window__function_list(config){
    if(config.attach_callback == true){
        if(config.callback){
            return {"title":"Invoke Method","renderer":render}
        }
    }

    function render(r_space,config,winname,wintitle){
        
        markup = generate_unclosed_window(winname,wintitle)
        markup += '<ul class="list-group" style="min-width:300px;margin:10px;text-transform: none !important">'
        $.each(module_map[config.args.category],function(){
            if(cmp(this.__Model__Configuration__.model,model)){
                $.each(this.__Model__Configuration__.stubs,function(fname,attribs){
                    if(!cmp(fname,"__init__")){
                        markup += '<li class="list-group-item">'+fname+'</li>'
                    }
                })
            }
        })
        markup += '<button type="button" class="btn btn-secondary btn-lg select-method">Select Method</button></ul></div>'
        
        r_space.append($(markup))
        
        $('#'+winname+' .list-group-item').click(function(){
            $('#'+winname+' .list-group-item').removeClass("active")
            $(this).addClass("active")
        })
        $('#'+winname+' .select-method').click(function(){
            active_method = null;
            $('#'+winname+' .list-group-item').each(function(){
                if($(this).hasClass("active")){
                    active_method = $(this).html()   
                    return
                }
            })
            if(active_method != null){
                closeWindow(winname)
                config.callback({"config":config,"value":active_method})
            }
            else{
                alert("Select a Method to Invoke")
            }
        })
    }
}

function window__invoke_params(config){
    if(config.attach_callback == true){
        if(config.callback){
            return {"title":"Attach Parameters and Invoke Method","renderer":render}
        }
    }
    function render(r_space,config,winname,wintitle){
        d_types=["std::string","int","double","boolean"]
        markup = generate_unclosed_window(winname,wintitle,"60%")
        
        method = config.args.method
        parent_config = method.config.args
        markup +=  '<div class="Xcontrols-container row">\
                    <div class="Xcontrols-hfdivide col"><strong class="Xsubheader">\
                    Variable Name </strong>\
                    <div class="list-group">\
                    </div>\
                    </div>\
                    <div class="Xcontrols-hfdivide col"><strong class="Xsubheader"> \
                    Value </strong> <ul class="nav nav-tabs Xcontrols-tab">\
                    <li class="active">\
                    <a data-toggle="tab" href="#" class="nav-link" role="tab" aria-controls="in-scope-var-select">in-Scope Vars</a></li>\
                    <li><a data-toggle="tab" href="#" class="nav-link" role="tab" aria-controls="custom-var-select">Custom</a></li>\
                    <li><a data-toggle="tab" href="#" class="nav-link" role="tab" aria-controls="builtin-method-call-select">Builtin Method call</a></li>\
                    </ul>\
                    <div class="tab-content">\
                    <div class="tab-pane fade in active show in-scope-var-select">\
                    </div>\
                    <div class="tab-pane fade custom-var-select">\
                    </div>\
                    <div class="tab-pane fade builtin-method-call-select" style="text-align:center;">\
                    </div>\
                    </div>\
                    </div>\
                    </div>\
                    <div style="text-align:center;">\
                    <button type="button" class="finalize-attach-params btn btn-outline-secondary disabled">ATTACH AND INVOKE</button>\
                    </div>'
        markup += '</div>'
        r_space.append($(markup))        
        $.each(module_map[parent_config.category],function(){
            model_config = this.__Model__Configuration__
            if(cmp(model_config.model,parent_config.model)){
                m_args = model_config.stubs[method.value].args[0]
                list_group = '#'+winname+' .Xcontrols-hfdivide:eq(0) .list-group '
                select_panel = '#'+winname+' .Xcontrols-hfdivide:eq(1)'
                inscopevars_list = {}
                f_dtype = {}
                $.each(m_args,function(variable,data_type){
                    le = '<a href="#" class="list-group-item list-group-item-action" data-name="'+variable+'" data-select="">'+variable+'</a>'
                    $(list_group).append($(le))
                    inscopevars_list[variable] = []
                    f_dtype[variable] = data_type
                    $.each(components,function(){
                        if(cmp(data_type,this.type)){
                            inscopevars_list[variable].push(this.varname)
                        }
                    })
                })
                attachinv_button =  $('#'+winname+' .finalize-attach-params')
                $(list_group+' .list-group-item').on('data-select-changed',function(){
                    abort_enable = false
                    $(list_group+' .list-group-item').each(function(){
                        val = $(this).attr('data-select').trim()

                        if(val.length == 0){
                            abort_enable=true;
                            return
                        }
                    })
                    console.log(abort_enable)
                    if(!abort_enable){
                        if(attachinv_button.hasClass('disabled')){
                            attachinv_button.removeClass('disabled')
                        }
                    }
                    else{
                        if(!attachinv_button.hasClass('disabled')){
                            attachinv_button.addClass('disabled')
                        }
                    }
                })

                attachinv_button.click(function(){
                    if(!$(this).hasClass('disabled')){
                        call_config = {}
                        call_config.method = method.value
                        call_config.callargs = {}
                        $(list_group+' .list-group-item').each(function(){
                            val = $(this).attr('data-select').trim()
                            name = $(this).attr('data-name').trim()
                            call_config.callargs[name] = val
                        })
                        config.callback(call_config)
                    }
                })

                $(select_panel+' .Xcontrols-tab:eq(0) li').click(function(){
                    panel_name = $(this).find('a').attr("aria-controls")
                    $(select_panel+' .tab-content .tab-pane').removeClass("active").removeClass("show")
                    $(select_panel+' .tab-content .'+panel_name).addClass("active").addClass("show")
                    index = $(this).index()
                    if(index == 1){
                        select_id = winname+"_customvar_select"
                        inp_id = winname+"_customvar_value"
                        cv_c = '<form class="form-group Xcontrol-form">\
                            <select class="form-control" id="'+select_id+'">\
                                <option value="__nodtype__">Select a Type</option>\
                                <option value="std::string">string</option>\
                                <option value="int">Integer</option>\
                                <option value="double">Float/Double</option>\
                                <option value="boolean">Boolean</option>\
                                </select>\
                            <input type="text" class="form-control" id="'+inp_id+'">\
                            <button  class="btn btn-success" type="submit">Set Value</button>\
                            </form>'
                        
                        $(select_panel+' .tab-content .'+panel_name).html("").append(cv_c);
                        $(list_group+' .list-group-item').each(function(){
                            classes = $(this).attr('class').split(' ')
                            if(classes.indexOf('active') >= 0){
                                d_sel = $(this).attr('data-select')
                                parts = ["",""]
                                at = d_sel.indexOf('@')
                                parts[0] = d_sel.substring(0,at) 
                                parts[1] = d_sel.substring(at+1)
                                d_type = d_types.indexOf(parts[0])
                                if(d_type >= 0){
                                    $('#'+winname+"_customvar_select").val(d_types[d_type])
                                    $('#'+winname+"_customvar_value").val(parts[1])
                                }
                                return 
                            }

                        })
                        $(select_panel+' .tab-content .'+panel_name).find('form').submit(function(){
                            d_type = $(this).find('#'+select_id).val()
                            val = $(this).find('#'+inp_id).val()
                            if(!cmp(d_type,"__nodtype__") && val.length > 0){
                                $(list_group+' .active:eq(0)').attr("data-select",d_type+"@"+val)
                                $(list_group+' .list-group-item').trigger('data-select-changed')
                            }
                            return false
                        })
                    }
                })

                $(list_group+' .list-group-item').click(function(){
                    $(list_group+' .list-group-item').removeClass("active");
                    lg = this
                    $(lg).addClass("active");
                    in_scope_vars = select_panel+' .tab-content .in-scope-var-select'
                    custom_vars = select_panel+' .tab-content .custom-var-select'
                    builtin_vars = select_panel+' .tab-content .builtin-method-call-select'
                    isv_code =  '<div class="list-group">'
                    variable_name = $(lg).attr("data-name").trim()
                    data_select = $(lg).attr("data-select")
                    parts = data_select.split("@")
                    select_id = winname+"_builtinmethod_select"
                    bm_c =  '<div class="form-group"><select class="form-control" id="'+select_id+'"><option value="__nodtype__">Select a Type</option>'
                    $.each(builtin_map,function(m_name,m_data){
                        if(cmp(f_dtype[variable_name],m_data.returns)){
                            m = '<option value="'+m_name+'">'+m_name+'</option>'
                            bm_c += m
                        }
                    })
                    bm_c += '</select></div><button type="button" class="btn btn-primary">Finalize</button>'
                    $(builtin_vars).html("").append(bm_c)
                    $(builtin_vars).on('change','select',function(){
                        chosen = $(this).val()
                        info = null
                        t_param = null
                        if(!cmp(chosen,"__nodtype__")){
                            info = builtin_map[chosen]
                            t_param = info.args[0].value
                        }
                        id = $(this).attr('id')
                        classname = $(this).parent().attr('class').split(' ')
                        if(classname.indexOf('sub-select') >=  0){
                            $(builtin_vars+' .form-group .sub-select.'+id+'__class').nextAll().remove()
                            $('#'+id+'__value').remove()
                        }
                        else{
                            $(builtin_vars+' .form-group .sub-select').remove()
                        }
                        
                        if(d_types.indexOf(t_param) < 0){
                            id_x = id+'__'+t_param
                            sub_select = '<div class="sub-select '+id_x+'_class"><select class="form-control" id="'+id_x+'"><option value="__nodtype__">Select a '+t_param+'</option>'
                            $.each(builtin_map,function(m_name,m_data){
                                if(cmp(t_param,m_data.returns)){
                                    m = '<option value="'+m_name+'">'+m_name+'</option>'
                                    sub_select += m
                                }
                            })
                            sub_select += '</select></div>'
                            $(builtin_vars+' .form-group').append(sub_select)
                        }
                        else{
                            inp_field = '<input type="text" class="form-control" id="'+id+'__value'+'"></input>'
                            $(this).parent().append($(inp_field))
                        }
                    })
                    
                    $(builtin_vars+' button').click(function(){
                        fgs = $(builtin_vars+' .form-group .sub-select')
                        master = $('#'+select_id).val()
                        bi_value = "built_in@"
                        if(!cmp(master,"__nodtype__")){
                            bi_value += master
                            fgs.find('select').each(function(index){
                                bi_value +=  "."+$(this).val()
                                if(index == fgs.length-1){
                                    bi_value += "{"+$(this).parent().find('input').val()+"}"
                                }
                            })
                            $(lg).attr('data-select',bi_value)
                            $(list_group+' .list-group-item').trigger('data-select-changed')
                        }
                    })

                    if(parts.length > 0){
                        if(cmp(parts[0],"built_in")){
                            fb = parts[1].indexOf('{')
                            value = parts[1].substring(fb+1,parts[1].length-1)
                            m_str = parts[1].substring(0,fb).split('.')
                            m_len = m_str.length
                            $('#'+select_id).val(m_str[0]).change()
                            for(j = 1 ; j < m_len ;j++){
                                last_sel = $('#'+select_id).parent().find('.sub-select:last')
                                last_sel.find('select').val(m_str[j]).change()
                                if(j == m_len-1){
                                    last_sel.find('input').val(value)
                                }
                            }
                        }
                    }

                    $.each(inscopevars_list[variable_name],function(){
                        c_s = 'list-group-item list-group-item-action'
                        if(parts.length > 0){
                            if(cmp(parts[0],"in_scope")){
                                c_s += " active"
                            }
                        }
                        isv_code += '<a href="#" class="'+c_s+'" data-name="'+this+'">'+this+'</a>'
                    })
                    d_type = d_types.indexOf(parts[0])
                    $('#'+winname+"_customvar_select").val("__nodtype__")
                    $('#'+winname+"_customvar_value").val("")
                    if(d_type >= 0){
                        $('#'+winname+"_customvar_select").val(d_types[d_type])
                        $('#'+winname+"_customvar_value").val(parts[1])
                    }
                    isv_code += '</div>'
                    $(in_scope_vars).html("").append(isv_code);
                    items = in_scope_vars+' .list-group .list-group-item'
                    $(items).click(function(){
                        $(items).removeClass("active")
                        $(this).addClass("active")
                        $(lg).attr("data-select","in_scope@"+$(this).attr("data-name"))
                        $(list_group+' .list-group-item').trigger('data-select-changed')
                    })
                })
            }
        })
    }
}
function generate_unclosed_window(winname,wintitle,min_width){
    markup = '<div id="'+winname+'" class="Xwindow" style="min-width:'+min_width+'">\
    <div class="Xtitle">'+wintitle+
    '<div class="Xicons"><div class="Xicon imin"></div><div class="Xicon iclose"></div></div>\
    </div>'

    return markup
}
function registerAllWindowTemplates(){
    register_template(FUNCTION_LIST_WINDOW,window__function_list);
    register_template(INVOKE_PARAMS_WINDOW,window__invoke_params);
}