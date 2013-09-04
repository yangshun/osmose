/**
 * RootController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {

  index: function (req, res) {
    if (req.session.fb_id == 0) {
        redirect_url = req.protocol + "://" + req.get('host') + '/'
        url = req.facebook.getLoginUrl({'redirect_uri': redirect_url, 'scope': 'publish_actions'});

        res.view({
            fb_login_url: url,
            _layoutFile: 'index.ejs',
            fb_user: undefined,
            title: 'Osmose'
        }); 
    } else {
        res.redirect('/feed');
    }
  },

  feed: function (req, res) {
    return res.view({
      fb_user: req.session.fb_user,
      display_type: 'feed',
      _layoutFile: '../layout.ejs'
    });
  },

  invite: function (req, res) {
    return res.view({
      fb_user: req.session.fb_user,
      _layoutFile: '../layout.ejs'
    });
  },

  about: function (req, res) {
    res.view({
      fb_user: req.session.fb_user,
      _layoutFile: 'about.ejs'
    });
  },

  team: function (req, res) {
    res.view({
      fb_user: req.session.fb_user,
      _layoutFile: 'team.ejs'
    });
  },

  help: function (req, res) {

    var markdown_table = [
      {
        key: '(Y)',
        value: 'thumbs-up'
      },
      {
        key: '(Y2)',
        value: 'thumbs-up-alt'
      },
      {
        key: '(: or :)',
        value: 'smile'
      },
      {
        key: '|: or :|',
        value: 'meh'
      },
      {
        key: '[male]',
        value: 'male'
      },
      {
        key: '[female]',
        value: 'female'
      },
      {
        key: '[bulb]',
        value: 'lightbulb'
      },
      {
        key: '[music]',
        value: 'music'
      },
      {
        key: '<3',
        value: 'heart'
      },
      {
        key: '[star]',
        value: 'star'
      },
      {
        key: '[star2]',
        value: 'star-empty'
      },
      {
        key: '[tick]',
        value: 'ok'
      },
      {
        key: '[cross]',
        value: 'remove'
      },
      {
        key: '[flag]',
        value: 'flag'
      },
      {
        key: '[coffee]',
        value: 'coffee'
      },
      {
        key: '[apple]',
        value: 'apple'
      },
      {
        key: '[android]',
        value: 'android'
      },
      {
        key: '[facebook]',
        value: 'facebook-sign'
      },
      {
        key: '[github]',
        value: 'github'
      },
      {
        key: '[instagram]',
        value: 'instagram'
      },
      {
        key: '[skype]',
        value: 'skype'
      },
      {
        key: '[tumblr]',
        value: 'tumblr'
      },
      {
        key: '[twitter]',
        value: 'twitter'
      },
      {
        key: '[youtube]',
        value: 'youtube'
      }];

    var two_col_table = [];
    var i = 0;

    while (i < markdown_table.length) {
      var pair = [];
      pair.push(markdown_table[i]);
      i++;
      if (i < markdown_table.length) {
        pair.push(markdown_table[i]);
      }
      two_col_table.push(pair);
      i++;
    }

    res.view({
      markdown_table: two_col_table,
      fb_user: req.session.fb_user,
      _layoutFile: 'help.ejs'
    });
  },

  logout: function(req, res) {
    req.session.destroy();
    res.redirect('/');
  }
};
