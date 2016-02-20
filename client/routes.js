Router.configure({
    layoutTemplate: 'layout'
});

Router.map(function () {
  this.route('home', {
    path: '/',
    template: 'index',
    layoutTemplate: 'layout',
  });
});

Router.map(function () {
  this.route('musicchat', {
    path: '/mc',
    template: 'musicchat',
    layoutTemplate: 'layout',
  });
});
