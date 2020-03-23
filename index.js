class minivue{
    constructor(options){
        this.$options = options;
        //数据
        this.$data = options.data;
        //挂在点
        this.$el = document.querySelector(options.el);
        //数据劫持
        this.observer(this.$data);

        //进行编译
        new Compile(this.$el,this);
    }

    observer(data){
        console.log(1)
        if(!data ||typeof data!=="object" )
        return;
       
        Object.keys(data).forEach(key=>{
            this.defineRective(data,key,data[key]);
            this.proxyData(key)
        })
    }
    defineRective(data,key,val){
       //递归  检测data属性的值是否还是一个对象 如果是则在进行遍历
       this.observer(key)
       var dep=new Dep()

       //添加getter和setter方法
       Object.defineProperty(data,key,{
           get(){
            // 依赖收集
            Dep.target &&dep.addDep(Dep.target);
            // 访问
            return val;
           },
           set(newval){
            // 设置
            if(naeval==val) return;
            val = newVal;
            dep.notify();
           }
       })    
    }
    proxyData(key){
        Object.defineProperty(this,key,{
            get(){
                return this.$data[key];
            },
            set(newVal){
                this.$data[key] = newVal;
            }
        })
    }
}