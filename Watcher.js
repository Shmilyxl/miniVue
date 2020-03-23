class watcher{
    constructor(node,vm,exp,cb){
      this.$vm=vm;
      this.$exp=exp;
      this.cb=cb;

      Dep.target=this;
      this.$vm[this.$exp];//这一步时触发get
      Dep.target=null;
    }
    update(){
        this.cb.call(this.$vm,this.$vm[this.$exp])
    }
}