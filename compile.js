//编译
class Compile{
    constructor(el,vm){
        this.$el=el;
        this.$vm=vm;

        if(this.$el){
        // 获取app下面的所有节点
        this.$Fragment = this.getNodeFragment(this.$el);
        //  进行编译 
          this.compile(this.$Fragment);
        //  将编译好的节点插入到app
        this.$el.appendChild(this.$Fragment) 
        }
    }
    getNodeFragment(root){
        console.log(root)
        // 创建文件碎片
        var frag=document.createDocumentFragment();
        var child;
        while(child=root.firstChild){
            frag.appendChild(child);
        }
        console.log(frag)
        return frag;
    }
    compile(fragment){
        var childNodes =fragment.childNodes;
        Array.from(childNodes).forEach((node)=>{
            // 判断文本节点
            
            if(this.isText(node)){
                this.compileText(node)
            }
            // console.log(node);

            // 判断是否是元素节点
            if(this.isElement(node)){
                var attrs =node.attributes;

                Array.from(attrs).forEach((attr)=>{
                    var key=attr.name;
                    var value =attr.value;
                    // 判断是否是指令
                    if(this.isDirective(key)){
                        var dir=key.substr(2);
                        this[dir+"update"]&& this[dir+'update'](node,this.$vm[value])
                    }
                    // 判断是否是事件
                    if(this.isEvent(key)){
                        var dir =key.substr(1);
                        this.handleEvent(node,this.$vm,value,dir)
                    }
                })
            }
            //如果子节点下面还有子节点那么就进行递归
            if(node.childNodes && node.childNodes.length>0){
                this.compile(node)
            }
        })
    }
    isText(node){
        return node.nodeType ===3 && /\{\{(.+)\}\}/.test(node.textContent);
    }
    isElement(node){
        return node.nodeType==1;
    }
    compileText(node){
        this.update(node,this.$vm,RegExp.$1,'text') 
   console.log(RegExp.$1)
        /*
             node      元素
             this.vm  vue的实例
             RegExp.$1   {{属性}}
             text      标识
        */
     }
     textupdate(node,value){
        node.textContent = value;
    }
    update(node,vm,exp,dir){
        var updateFn = this[dir+"update"];
        updateFn&& updateFn(node,vm[exp]);

        new watcher(node,vm,exp,(value)=>{
            updateFn&& updateFn(node,vm[exp]);
        })
    }
       //判断指令
       isDirective(attr){
        return attr.indexOf("v-") === 0;
    }
    //判断事件
    isEvent(attr){
        return attr.indexOf("@") === 0;
    }
    //事件处理
    handleEvent(node,vm,callback,type){
        //判断methods是否存在  以及callback函数是否在methods中  如果存在则进行绑定
        var fn = vm.$options.methods &&  vm.$options.methods[callback];
        node.addEventListener(type,fn.bind(vm));
    }
}


