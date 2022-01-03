---
layout: post
title:  "Welcome to Jekyll!"
date:   2021-11-30 00:39:47 +0800
categories: jekyll update
---
You’ll find this post in your `_posts` directory. Go ahead and edit it and re-build the site to see your changes. You can rebuild the site in many different ways, but the most common way is to run `jekyll serve`, which launches a web server and auto-regenerates your site when a file is updated.

Jekyll requires blog post files to be named according to the following format:

`YEAR-MONTH-DAY-title.MARKUP`

Where `YEAR` is a four-digit number, `MONTH` and `DAY` are both two-digit **numbers**, and `MARKUP` is the file extension representing the format used in the file. After that, include the necessary front matter. Take a look at the source for this post to get an idea about how it works.

Jekyll also offers powerful support for code snippets:

```ruby
abc
```

```html
<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
  <meta http-equiv="content-type" content="text/html; charset=utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <title>ARP Networks Control Panel</title>
  <%= stylesheet_link_tag 'application', media: 'all', 'data-turbolinks-track': 'reload' %>
  <%= javascript_pack_tag 'application', 'data-turbolinks-track': 'reload' %>
  <%= javascript_include_tag 'application', 'data-turbolinks-track': 'reload' %>
  <%= csrf_meta_tags %>

  <% if (controller.controller_name == 'my_account' && controller.action_name == 'dashboard') -%>
  <!-- Stripe -->
  <script src="https://js.stripe.com/v3" async></script>
  <% end %>
  <% if controller.controller_name == 'credit_cards' || controller.controller_name == 'services' %>
  <!-- Stripe -->
  <script src="https://js.stripe.com/v3"></script>
  <% end -%>

  <!-- Font Awesome 5.0 -->
  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.13/css/all.css" integrity="sha384-DNOHZ68U8hZfKXOrtjWvjxusGo9WQnrNx2sqG0tfsghAvtVlRW3tvkXWZh58N9jp" crossorigin="anonymous">

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.gstatic.com">
  <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono&display=swap" rel="stylesheet">

  <!-- favicons -->
  <link rel="apple-touch-icon" sizes="57x57" href="/favicons/apple-icon-57x57.png">
  <link rel="apple-touch-icon" sizes="60x60" href="/favicons/apple-icon-60x60.png">
  <link rel="apple-touch-icon" sizes="72x72" href="/favicons/apple-icon-72x72.png">
  <link rel="apple-touch-icon" sizes="76x76" href="/favicons/apple-icon-76x76.png">
  <link rel="apple-touch-icon" sizes="114x114" href="/favicons/apple-icon-114x114.png">
  <link rel="apple-touch-icon" sizes="120x120" href="/favicons/apple-icon-120x120.png">
  <link rel="apple-touch-icon" sizes="144x144" href="/favicons/apple-icon-144x144.png">
  <link rel="apple-touch-icon" sizes="152x152" href="/favicons/apple-icon-152x152.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-icon-180x180.png">
  <link rel="icon" type="image/png" sizes="192x192"  href="/favicons/android-icon-192x192.png">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="96x96" href="/favicons/favicon-96x96.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png">
  <link rel="manifest" href="/favicons/manifest.json">
  <meta name="msapplication-TileColor" content="#ffffff">
  <meta name="msapplication-TileImage" content="/favicons/ms-icon-144x144.png">
  <meta name="msapplication-config" content="/favicons/browserconfig.xml" />
  <meta name="theme-color" content="#ffffff">

</head>
<body>

<div class="main-container">
  <div class="logo">
    <a href='<%= dashboard_path %>'><img src='/images/logo-small-new.jpg' width='264' height='29' alt='Logo' class="logo" align="top"/></a>
  </div>
  <div class="logo-features">
    <div class="logo-caption">
      Customer Control Panel
    </div>
    <div class="basic-nav-links">
    <% if account_signed_in? %>
      <%= link_to('Logout', destroy_account_session_path, method: :delete, :class => "logout") %>
      <span id="changelog"></span>
    <% else %>
      &nbsp;
      &nbsp;
      <%= link_to('Login', new_account_session_path, :class => "login") %>

    <% end %>
    </div>
  </div>

  <div class="logo-divider"></div>

  <%= render_flash %>

  <div class="main-content">
    <%= yield :layout %>
  </div>

  <div class="footer">
    <div class="copyright">
      Copyright &copy; 1999 - 2021 ARP Networks, Inc.  All Rights Reserved.
    </div>
    <div class="attribution">
      Icons provided by <a href='http://www.famfamfam.com/'>famfamfam</a>, <a href='http://www.freepik.com/'>Freepik</a>, <a href='http://www.flaticon.com/'>Flaticon</a>, and <a href='http://www.free-country-flags.com/'>Free Country Flags</a>
    </div>
  </div>
</div>

<script type='text/javascript'>
  <%= yield :js %>
</script>

</body>
</html>

```

```js
function sanitizeKey(key) {
  try {
    if (key.length < 32) {
      throw "Key length too small";
    }

    if (key.split(" ").length != 3) {
      throw "Key has bad format";
    }
  } catch (err) {
    return "";
  }

  return key;
}

if (typeof module !== "undefined") {
  module.exports = {
    usernameFromPubKey: usernameFromPubKey,
    labelFromPubKey: labelFromPubKey,
    sanitizeKey: sanitizeKey,
  };
}
```

```ruby
module Trello
  module AssociationBuilder
    class HasMany
      class << self
        def build(model_klass, name, options)
          model_klass.class_eval do
            define_method(name) do |*args|
              has_many_fetcher = AssociationFetcher::HasMany.new(self, name, options)
              filter_params = args[0] || {}
              has_many_fetcher.fetch(filter_params)
            end
          end
        end
      end
    end
  end
end
```

```ruby
def print_hi(name)
  puts "Hi, #{name}"
end
print_hi('Tom')
#=> prints 'Hi, Tom' to STDOUT.
```

```js
function() {
  console.log(123);
  var a = 123;
  b();
}
```

```bash
cd /etc/nginx
vim abc.rb
```

```html
<div data-controller="navbar" class="btn">
  Submit
</div>
```

```css
.highlight .k {
color:#f0dfaf;
}
```

```ruby
# frozen_string_literal: true

require 'oauth'
require 'json'
require 'logger'
require 'active_model'
require 'addressable/uri'
require 'active_support/core_ext/hash/indifferent_access'

# Ruby wrapper around the [Trello] API
#
# First, set up your key information. You can get this information by [clicking here][trello-app-key].
#
# You can get the key by going to this url in your browser:
# https://trello.com/1/authorize?key=TRELLO_CONSUMER_KEY_FROM_ABOVE&name=MyApp&response_type=token&scope=read,write,account&expiration=never
# Only request the permissions you need; i.e., scope=read if you only need read, or scope=write if you only need write. Comma separate scopes you need.
# If you want your token to expire after 30 days, drop the &expiration=never. Then run the following code, where KEY denotes the key returned from the
# url above:
#
# Trello.configure do |config|
#   config.consumer_key = TRELLO_CONSUMER_KEY
#   config.consumer_secret = TRELLO_CONSUMER_SECRET
#   config.oauth_token = TRELLO_OAUTH_TOKEN
#   config.oauth_token_secret = TRELLO_OAUTH_TOKEN_SECRET
# end
#
# All the calls this library make to Trello require authentication using these keys. Be sure to protect them.
#
# So lets say you want to get information about the user *bobtester*. We can do something like this:
#
#   bob = Member.find("bobtester")
#   # Print out his name
#   puts bob.full_name # "Bob Tester"
#   # Print his bio
#   puts bob.bio # A wonderfully delightful test user
#   # How about a list of his boards?
#   bob.boards
#
# And so much more. Consult the rest of the documentation for more information.
#
# Feel free to [peruse and participate in our Trello board][ruby-trello-board]. It's completely open to the public.
#
# [trello]: http://trello.com
# [trello-app-key]: https://trello.com/app-key
# [ruby-trello-board]: https://trello.com/board/ruby-trello/4f092b2ee23cb6fe6d1aaabd
module Trello
  autoload :Error,                'trello/error'
  autoload :Action,               'trello/action'
  autoload :Comment,              'trello/comment'
  autoload :Association,          'trello/association'
  autoload :AssociationProxy,     'trello/association_proxy'
  autoload :Attachment,           'trello/attachment'
  autoload :CoverImage,           'trello/cover_image'
  autoload :BasicData,            'trello/basic_data'
  autoload :Board,                'trello/board'
  autoload :Card,                 'trello/card'
  autoload :Checklist,            'trello/checklist'
  autoload :Client,               'trello/client'
  autoload :Configuration,        'trello/configuration'
  autoload :CustomField,          'trello/custom_field'
  autoload :CustomFieldItem,      'trello/custom_field_item'
  autoload :CustomFieldOption,    'trello/custom_field_option'
  autoload :HasActions,           'trello/has_actions'
  autoload :Item,                 'trello/item'
  autoload :CheckItemState,       'trello/item_state'
  autoload :Label,                'trello/label'
  autoload :LabelName,            'trello/label_name'
  autoload :List,                 'trello/list'
  autoload :Member,               'trello/member'
  autoload :MultiAssociation,     'trello/multi_association'
  autoload :Notification,         'trello/notification'
  autoload :Organization,         'trello/organization'
  autoload :PluginDatum,          'trello/plugin_datum'
  autoload :Request,              'trello/net'
  autoload :TInternet,            'trello/net'
  autoload :Token,                'trello/token'
  autoload :Webhook,              'trello/webhook'
  autoload :JsonUtils,            'trello/json_utils'
  autoload :AssociationInferTool, 'trello/association_infer_tool'
  autoload :Schema,               'trello/schema'

  module Authorization
    autoload :AuthPolicy,         'trello/authorization'
    autoload :BasicAuthPolicy,    'trello/authorization'
    autoload :OAuthPolicy,        'trello/authorization'
  end

  module AssociationFetcher
    autoload :HasMany,            'trello/association_fetcher/has_many'
    autoload :HasOne,             'trello/association_fetcher/has_one'
  end

  module AssociationBuilder
    autoload :HasMany,            'trello/association_builder/has_many'
    autoload :HasOne,             'trello/association_builder/has_one'
  end

  # Version of the Trello API that we use by default.
  API_VERSION = 1

  # This specific error is thrown when your access token is invalid. You should get a new one.
  InvalidAccessToken = Class.new(Error)

  # This error is thrown when your client has not been configured
  ConfigurationError = Class.new(Error)

  def self.logger
    @logger ||= Logger.new(STDOUT)
  end

  def self.logger=(logger)
    @logger = logger
  end

  def self.client
    @client ||= Client.new
  end

  def self.configure(&block)
    reset!
    client.configure(&block)
  end

  def self.reset!
    @client = nil
  end

  def self.auth_policy; client.auth_policy; end
  def self.configuration; client.configuration; end

  # Url to Trello API public key page
  def self.public_key_url
    'https://trello.com/app-key'
  end

  # Url to token for making authorized requests to the Trello API
  #
  # @param options [Hash] Repository information to update
  # @option options [String] :name Name of the application
  # @option options [String] :key Application key
  # @option options [String] :response_type 'token'
  # @option options [String] :callback_method 'postMessage' or 'fragment'
  # @option options [String] :return_url URL the token should be returned to
  # @option options [String] :scope Comma-separated list of one or more of 'read', 'write', 'account'
  # @option options [String] :expiration '1hour', '1day', '30days', 'never'
  # @see https://developers.trello.com/authorize
  def self.authorize_url(options = {})
    params = options.dup
    params[:key] ||= configuration.developer_public_key or
      raise ArgumentError, 'Please configure your Trello public key'
    params[:name] ||= 'Ruby Trello'
    params[:scope] ||= 'read,write,account'
    params[:expiration] ||= 'never'
    params[:response_type] ||= 'token'
    uri = Addressable::URI.parse 'https://trello.com/1/authorize'
    uri.query_values = params
    uri
  end

  # Visit the Trello API public key page
  #
  # @see https://trello.com/app-key
  def self.open_public_key_url
    open_url public_key_url
  end

  # Visit the Trello authorized token page
  #
  # @see https://developers.trello.com/authorize
  def self.open_authorization_url(options = {})
    open_url authorize_url(options)
  end

  # @private
  def self.open_url(url)
    require 'launchy'
    Launchy.open(url.to_s)
  rescue LoadError
    warn 'Please install the launchy gem to open the url automatically.'
    url
  end
end

```


Check out the [Jekyll docs][jekyll-docs] for more info on how to get the most out of Jekyll. File all bugs/feature requests at [Jekyll’s GitHub repo][jekyll-gh]. If you have questions, you can ask them on [Jekyll Talk][jekyll-talk].

[jekyll-docs]: https://jekyllrb.com/docs/home
[jekyll-gh]:   https://github.com/jekyll/jekyll
[jekyll-talk]: https://talk.jekyllrb.com/
