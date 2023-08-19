import { Navbar } from 'flowbite-react';
const navbar = () => {
  return (
    <div>
    <Navbar>
      <Navbar.Brand
    
        href="/"
      >
        <img
            alt="MIXD Logo"
        //  className="mr-3 h-6 sm:h-9"
            src="/next.svg"
            width={102}
            height={29}
        />
        
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse>
        <Navbar.Link
          active
          href="/"
        >
          <p>
            Home
          </p>
        </Navbar.Link>
        <Navbar.Link
          // as={{
          //   $$typeof: Symbol(react.forward_ref),
          //   default: '[Circular]',
          //   render: function LinkComponent(props,forwardedRef){let children;const{href:hrefProp,as:asProp,children:childrenProp,prefetch:prefetchProp=null,passHref:passHref,replace:replace,shallow:shallow,scroll:scroll,locale:locale,onClick:onClick,onMouseEnter:onMouseEnterProp,onTouchStart:onTouchStartProp,legacyBehavior:legacyBehavior=!1,...restProps}=props;children=childrenProp,!legacyBehavior||"string"!=typeof children&&"number"!=typeof children||(children=_react.default.createElement("a",null,children));const pagesRouter=_react.default.useContext(_routercontext.RouterContext),appRouter=_react.default.useContext(_approutercontext.AppRouterContext),router=null!=pagesRouter?pagesRouter:appRouter,isAppRouter=!pagesRouter,prefetchEnabled=!1!==prefetchProp,appPrefetchKind=null===prefetchProp?_routerreducertypes.PrefetchKind.AUTO:_routerreducertypes.PrefetchKind.FULL;const{href:href,as:as}=_react.default.useMemo((()=>{if(!pagesRouter){const resolvedHref=formatStringOrUrl(hrefProp);return{href:resolvedHref,as:asProp?formatStringOrUrl(asProp):resolvedHref}}const[resolvedHref,resolvedAs]=(0,_resolvehref.resolveHref)(pagesRouter,hrefProp,!0);return{href:resolvedHref,as:asProp?(0,_resolvehref.resolveHref)(pagesRouter,asProp):resolvedAs||resolvedHref}}),[pagesRouter,hrefProp,asProp]),previousHref=_react.default.useRef(href),previousAs=_react.default.useRef(as);let child;legacyBehavior&&(child=_react.default.Children.only(children));const childRef=legacyBehavior?child&&"object"==typeof child&&child.ref:forwardedRef,[setIntersectionRef,isVisible,resetVisible]=(0,_useintersection.useIntersection)({rootMargin:"200px"}),setRef=_react.default.useCallback((el=>{previousAs.current===as&&previousHref.current===href||(resetVisible(),previousAs.current=as,previousHref.current=href),setIntersectionRef(el),childRef&&("function"==typeof childRef?childRef(el):"object"==typeof childRef&&(childRef.current=el))}),[as,childRef,href,resetVisible,setIntersectionRef]);_react.default.useEffect((()=>{router&&isVisible&&prefetchEnabled&&prefetch(router,href,as,{locale:locale},{kind:appPrefetchKind},isAppRouter)}),[as,href,isVisible,locale,prefetchEnabled,null==pagesRouter?void 0:pagesRouter.locale,router,isAppRouter,appPrefetchKind]);const childProps={ref:setRef,onClick(e){legacyBehavior||"function"!=typeof onClick||onClick(e),legacyBehavior&&child.props&&"function"==typeof child.props.onClick&&child.props.onClick(e),router&&(e.defaultPrevented||function linkClicked(e,router,href,as,replace,shallow,scroll,locale,isAppRouter,prefetchEnabled){const{nodeName:nodeName}=e.currentTarget;if("A"===nodeName.toUpperCase()&&(function isModifiedEvent(event){const target=event.currentTarget.getAttribute("target");return target&&"_self"!==target||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||event.nativeEvent&&2===event.nativeEvent.which}(e)||!isAppRouter&&!(0,_islocalurl.isLocalURL)(href)))return;e.preventDefault();const navigate=()=>{"beforePopState"in router?router[replace?"replace":"push"](href,as,{shallow:shallow,locale:locale,scroll:scroll}):router[replace?"replace":"push"](as||href,{forceOptimisticNavigation:!prefetchEnabled})};isAppRouter?_react.default.startTransition(navigate):navigate()}(e,router,href,as,replace,shallow,scroll,locale,isAppRouter,prefetchEnabled))},onMouseEnter(e){legacyBehavior||"function"!=typeof onMouseEnterProp||onMouseEnterProp(e),legacyBehavior&&child.props&&"function"==typeof child.props.onMouseEnter&&child.props.onMouseEnter(e),router&&(!prefetchEnabled&&isAppRouter||prefetch(router,href,as,{locale:locale,priority:!0,bypassPrefetchedCheck:!0},{kind:appPrefetchKind},isAppRouter))},onTouchStart(e){legacyBehavior||"function"!=typeof onTouchStartProp||onTouchStartProp(e),legacyBehavior&&child.props&&"function"==typeof child.props.onTouchStart&&child.props.onTouchStart(e),router&&(!prefetchEnabled&&isAppRouter||prefetch(router,href,as,{locale:locale,priority:!0,bypassPrefetchedCheck:!0},{kind:appPrefetchKind},isAppRouter))}};if((0,_utils.isAbsoluteUrl)(as))childProps.href=as;else if(!legacyBehavior||passHref||"a"===child.type&&!("href"in child.props)){const curLocale=void 0!==locale?locale:null==pagesRouter?void 0:pagesRouter.locale,localeDomain=(null==pagesRouter?void 0:pagesRouter.isLocaleDomain)&&(0,_getdomainlocale.getDomainLocale)(as,curLocale,null==pagesRouter?void 0:pagesRouter.locales,null==pagesRouter?void 0:pagesRouter.domainLocales);childProps.href=localeDomain||(0,_addbasepath.addBasePath)((0,_addlocale.addLocale)(as,curLocale,null==pagesRouter?void 0:pagesRouter.defaultLocale))}return legacyBehavior?_react.default.cloneElement(child,childProps):_react.default.createElement("a",{...restProps,...childProps},children)}
          // }}
          href="#"
        >
          <p>
            About
          </p>
        </Navbar.Link>
        <Navbar.Link href="/services">
          Services
        </Navbar.Link>
        <Navbar.Link href="/pricing">
          Pricing
        </Navbar.Link>
        <Navbar.Link href="/contact">
          Contact
        </Navbar.Link>
      </Navbar.Collapse>
      </Navbar>
      </div>
  )
}
export default navbar