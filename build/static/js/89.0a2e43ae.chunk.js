(this["webpackJsonpmain-bt5"]=this["webpackJsonpmain-bt5"]||[]).push([[89,169],{141:function(e,t,c){"use strict";var s=c(63),n=c(12),r=c(58),i=c(3);t.a=function(e){var t=Object(n.f)(),c=t.pathname.split("/")[1],a=t.pathname.split("/")[2];return Object(i.jsxs)(i.Fragment,{children:[Object(i.jsx)("h4",{children:e.heading}),Object(i.jsxs)(s.c,{children:[Object(i.jsx)(s.d,{to:"/",tag:r.b,className:"text-decoration-none",children:"Home"}),c?Object(i.jsx)(s.d,{active:!0,children:c}):"",a?Object(i.jsx)(s.d,{active:!0,children:a}):""]})]})}},1429:function(e,t,c){"use strict";c.r(t);var s=c(2),n=c(9),r=c(27),i=c(1),a=c(63),o=c(12),l=c(160),d=c(185),j=c.n(d),b=c(146),h=c(141),u=c(148),O=c(7),x=c(205),m=c(64),g=c(3);t.default=function(){var e=Object(i.useState)({category_title:"",creation_date:j()()}),t=Object(r.a)(e,2),c=t[0],d=t[1],p=Object(o.g)(),f=Object(i.useContext)(m.b).loggedInuser;return Object(g.jsxs)("div",{children:[Object(g.jsx)(h.a,{}),Object(g.jsx)(l.a,{}),Object(g.jsx)(a.eb,{children:Object(g.jsx)(a.s,{md:"6",xs:"12",children:Object(g.jsx)(u.default,{title:"Key Details",children:Object(g.jsxs)(a.A,{children:[Object(g.jsx)(a.C,{children:Object(g.jsx)(a.eb,{children:Object(g.jsxs)(a.s,{md:"12",children:[Object(g.jsxs)(a.H,{children:["Title",Object(g.jsx)("span",{className:"required",children:" *"})]}),Object(g.jsx)(a.E,{type:"text",name:"category_title",onChange:function(e){!function(e){d(Object(n.a)(Object(n.a)({},c),{},Object(s.a)({},e.target.name,e.target.value)))}(e)}})]})})}),Object(g.jsx)(a.C,{children:Object(g.jsx)(a.eb,{children:Object(g.jsxs)("div",{className:"pt-3 mt-3 d-flex align-items-center gap-2",children:[Object(g.jsx)(a.e,{color:"primary",type:"button",className:"btn mr-2 shadow-none",onClick:function(){c.creation_date=x.a,c.created_by=f.first_name,""!==c.category_title?O.a.post("/category/insertCategory",c).then((function(e){var t=e.data.data.insertId;Object(b.a)("CategoryDetails inserted successfully.","success"),setTimeout((function(){p("/CategoryEdit/".concat(t))}),300)})).catch((function(){Object(b.a)("Unable to edit record.","error")})):Object(b.a)("Please fill all required fields","warning")},children:"Save & Continue"}),Object(g.jsx)(a.e,{type:"submit",className:"btn btn-dark shadow-none",onClick:function(e){window.confirm("Are you sure you want to cancel? ")?p("/Category"):e.preventDefault()},children:"Cancel"})]})})})]})})})})]})}},146:function(e,t,c){"use strict";var s=c(160);c(186);t.a=function(e,t){return"success"===t?s.b.success(e,{position:"top-right",autoClose:5e3,hideProgressBar:!1,closeOnClick:!0,pauseOnHover:!0,draggable:!0,progress:void 0,theme:"colored"}):"error"===t?s.b.error(e,{position:"top-right",autoClose:5e3,hideProgressBar:!1,closeOnClick:!0,pauseOnHover:!0,draggable:!0,progress:void 0,theme:"colored"}):"info"===t?s.b.info(e,{position:"top-right",autoClose:5e3,hideProgressBar:!1,closeOnClick:!0,pauseOnHover:!0,draggable:!0,progress:void 0,theme:"colored"}):"warning"===t?s.b.warning(e,{position:"top-right",autoClose:5e3,hideProgressBar:!1,closeOnClick:!0,pauseOnHover:!0,draggable:!0,progress:void 0,theme:"colored"}):Object(s.b)(e)}},148:function(e,t,c){"use strict";c.r(t);var s=c(63),n=(c(1),c(3));function r(e){var t=e.details,c=void 0===t?null:t,r=e.title;return Object(n.jsx)(n.Fragment,{children:Object(n.jsx)(s.o,{tag:"h4",className:"border-bottom px-4 py-3 mb-0",children:Object(n.jsxs)(s.eb,{children:[Object(n.jsx)(s.s,{children:r}),c&&Object(n.jsxs)(s.s,{children:[Object(n.jsx)(s.eb,{children:Object(n.jsxs)("span",{style:{fontSize:"0.7em"},children:[" Creation: ",c&&c.created_by," ",c&&c.creation_date]})}),Object(n.jsx)(s.eb,{className:"d-flex",children:Object(n.jsxs)("span",{style:{fontSize:"0.7em"},children:[" Modified: ",c&&c.modified_by," ",c&&c.modification_date]})})]})]})})})}t.default=function(e){var t=e.children,c=e.title,i=e.subtitle,a=e.creationModificationDate;return Object(n.jsxs)(s.i,{className:"shadow-none",children:[Object(n.jsx)(r,{details:a,title:c}),Object(n.jsxs)(s.j,{className:"p-4",children:[Object(n.jsx)(s.m,{className:"text-muted mb-3",children:i||""}),Object(n.jsx)("div",{children:t})]})]})}},205:function(e,t,c){"use strict";var s=c(185),n=c.n(s)()().format("DD-MM-YYYY h:mm:ss a");t.a=n}}]);
//# sourceMappingURL=89.0a2e43ae.chunk.js.map