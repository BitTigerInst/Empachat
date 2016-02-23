Router.configure({
    layoutTemplate: 'application-layout'
});

Router.map(function () {
  this.route('home', {
    path: '/',
    template: 'home',
    layoutTemplate: 'application-layout',
  });
});

Router.map(function () {
  this.route('chat', {
    path: '/chat',
    template: 'chat',
    layoutTemplate: 'application-layout',
  });
});

