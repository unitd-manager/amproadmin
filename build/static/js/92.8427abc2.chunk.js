(this["webpackJsonpmain-bt5"]=this["webpackJsonpmain-bt5"]||[]).push([[92,169],{141:function(e,t,s){"use strict";var c=s(63),n=s(12),i=s(58),r=s(3);t.a=function(e){var t=Object(n.f)(),s=t.pathname.split("/")[1],a=t.pathname.split("/")[2];return Object(r.jsxs)(r.Fragment,{children:[Object(r.jsx)("h4",{children:e.heading}),Object(r.jsxs)(c.c,{children:[Object(r.jsx)(c.d,{to:"/",tag:i.b,className:"text-decoration-none",children:"Home"}),s?Object(r.jsx)(c.d,{active:!0,children:s}):"",a?Object(r.jsx)(c.d,{active:!0,children:a}):""]})]})}},1439:function(e,t,s){"use strict";s.r(t);var c=s(2),n=s(9),i=s(27),r=s(1),a=s(63),o=s(160),d=s(12),l=s(185),j=s.n(l),b=s(141),u=s(148),h=s(7),O=s(146),m=s(205),x=s(64),f=s(3);t.default=function(){var e=Object(r.useState)({first_name:"",creation_date:j()()}),t=Object(i.a)(e,2),s=t[0],l=t[1],p=Object(d.g)(),g=Object(r.useContext)(x.b).loggedInuser;return Object(r.useEffect)((function(){}),[]),Object(f.jsxs)("div",{children:[Object(f.jsx)(b.a,{}),Object(f.jsx)(o.a,{}),Object(f.jsx)(a.eb,{children:Object(f.jsx)(a.s,{md:"6",xs:"12",children:Object(f.jsx)(u.default,{title:"Key Details",children:Object(f.jsxs)(a.A,{children:[Object(f.jsx)(a.C,{children:Object(f.jsx)(a.eb,{children:Object(f.jsxs)(a.s,{md:"12",children:[Object(f.jsxs)(a.H,{children:[" ","Name ",Object(f.jsx)("span",{className:"required",children:" *"})," "]}),Object(f.jsx)(a.E,{type:"text",name:"first_name",onChange:function(e){l(Object(n.a)(Object(n.a)({},s),{},Object(c.a)({},e.target.name,e.target.value)))}})]})})}),Object(f.jsx)(a.C,{children:Object(f.jsx)(a.eb,{children:Object(f.jsxs)("div",{className:"pt-3 mt-3 d-flex align-items-center gap-2",children:[Object(f.jsx)(a.e,{color:"primary",onClick:function(){s.creation_date=m.a,s.created_by=g.first_name,h.a.post("/enquiry/insertEnquiry",s).then((function(e){var t=e.data.data.insertId;console.log(t),Object(O.a)("enquiry inserted successfully.","success"),setTimeout((function(){p("/EnquiryEdit/".concat(t))}),300)})).catch((function(){Object(O.a)("Network connection error.","error")})),setTimeout((function(){p("/EnquiryEdit")}),800)},type:"button",className:"btn mr-2 shadow-none",children:"Save & Continue"}),Object(f.jsx)(a.e,{onClick:function(){p("/Blog")},type:"button",className:"btn btn-dark shadow-none",children:"Go to List"})]})})})]})})})})]})}},146:function(e,t,s){"use strict";var c=s(160);s(186);t.a=function(e,t){return"success"===t?c.b.success(e,{position:"top-right",autoClose:5e3,hideProgressBar:!1,closeOnClick:!0,pauseOnHover:!0,draggable:!0,progress:void 0,theme:"colored"}):"error"===t?c.b.error(e,{position:"top-right",autoClose:5e3,hideProgressBar:!1,closeOnClick:!0,pauseOnHover:!0,draggable:!0,progress:void 0,theme:"colored"}):"info"===t?c.b.info(e,{position:"top-right",autoClose:5e3,hideProgressBar:!1,closeOnClick:!0,pauseOnHover:!0,draggable:!0,progress:void 0,theme:"colored"}):"warning"===t?c.b.warning(e,{position:"top-right",autoClose:5e3,hideProgressBar:!1,closeOnClick:!0,pauseOnHover:!0,draggable:!0,progress:void 0,theme:"colored"}):Object(c.b)(e)}},148:function(e,t,s){"use strict";s.r(t);var c=s(63),n=(s(1),s(3));function i(e){var t=e.details,s=void 0===t?null:t,i=e.title;return Object(n.jsx)(n.Fragment,{children:Object(n.jsx)(c.o,{tag:"h4",className:"border-bottom px-4 py-3 mb-0",children:Object(n.jsxs)(c.eb,{children:[Object(n.jsx)(c.s,{children:i}),s&&Object(n.jsxs)(c.s,{children:[Object(n.jsx)(c.eb,{children:Object(n.jsxs)("span",{style:{fontSize:"0.7em"},children:[" Creation: ",s&&s.created_by," ",s&&s.creation_date]})}),Object(n.jsx)(c.eb,{className:"d-flex",children:Object(n.jsxs)("span",{style:{fontSize:"0.7em"},children:[" Modified: ",s&&s.modified_by," ",s&&s.modification_date]})})]})]})})})}t.default=function(e){var t=e.children,s=e.title,r=e.subtitle,a=e.creationModificationDate;return Object(n.jsxs)(c.i,{className:"shadow-none",children:[Object(n.jsx)(i,{details:a,title:s}),Object(n.jsxs)(c.j,{className:"p-4",children:[Object(n.jsx)(c.m,{className:"text-muted mb-3",children:r||""}),Object(n.jsx)("div",{children:t})]})]})}},205:function(e,t,s){"use strict";var c=s(185),n=s.n(c)()().format("DD-MM-YYYY h:mm:ss a");t.a=n}}]);
//# sourceMappingURL=92.8427abc2.chunk.js.map