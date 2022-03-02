/* eslint-disable */
/**
 * VueRouter实现原理：
 * 1.使用Vue.observerable({ current: '/' }) 将VueRouter实例里data.current定义为响应式数据
 * 2.将VueRouter传过来的routes参数遍历成path: components键值对形式，并使用router-view组件根据this.data.current当前地址对应的路由渲染到页面中
 * 3.history模式点击跳转使用history.pushState({},"",this.to) 来改变浏览器地址，同时改变this.data.current使用响应式自动渲染对应组件
 * 4.history.pushState只会改变浏览器地址，历史记录改变使用popstate事件监听，通过获取当前地址window.location.pathname来改变this.data.current使用响应式自动渲染对应组件
 */
let _Vue = null
export default class VueRouter {
    static install(Vue){
        //1 判断当前插件是否被安装
        if(VueRouter.install.installed){
            return;
        }
        VueRouter.install.installed = true
        //2 把Vue的构造函数记录在全局
        _Vue = Vue
        //3 把创建Vue的实例传入的router对象注入到Vue实例
        // _Vue.prototype.$router = this.$options.router
        _Vue.mixin({
            beforeCreate(){
                if(this.$options.router){
                    _Vue.prototype.$router = this.$options.router
                    
                }
               
            }
        })
    }
    constructor(options){
        this.options = options
        this.routeMap = {}
        // observable
        this.data = _Vue.observable({
            current:"/"
        })
        this.init()

    }
    init(){
        this.createRouteMap()
        this.initComponent(_Vue)
        this.initEvent()
    }
    createRouteMap(){
        //遍历所有的路由规则 吧路由规则解析成键值对的形式存储到routeMap中
        this.options.routes.forEach(route => {
            this.routeMap[route.path] = route.component
        });
    }
    initComponent(Vue){
        Vue.component("router-link",{
            props:{
                to:String
            },
            render(h){
                return h("a",{
                    attrs:{
                        href:this.to
                    },
                    on:{
                        click:this.clickhander
                    }
                },[this.$slots.default])
            },
            methods:{
                clickhander(e){
                    history.pushState({},"",this.to)
                    this.$router.data.current=this.to
                    e.preventDefault()
                }
            }
            // template:"<a :href='to'><slot></slot><>"
        })
        const self = this
        Vue.component("router-view",{
            render(h){
                // self.data.current
                const cm=self.routeMap[self.data.current]
                console.log(self.data.current);
                return h(cm)
            }
        })
        
    }
    initEvent(){
        // 监听路由变化
        window.addEventListener("popstate",()=>{
            this.data.current = window.location.pathname
        })
    }
}