---
permalink: /rest-man/:title
---
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ page.title }}</title>

  {% include favicon.html %}

  <link rel="stylesheet" href="/css/{{ 'rest-man/post.css' | bust_css_cache }}">
  <link rel="stylesheet" href="/css/{{ 'rest-man/syntax-highlight.css' | bust_css_cache }}">
  {% include rest-man/importmap.html %}
  <script type="module" src="/js/{{ 'rest-man/post.js' | bust_js_cache }}">

  {% include custom_css.html %}

  {% seo %}
</head>

<body>

  <nav class="sidebar">
    <h1>
      <a href="/rest-man" class="rest-man">rest-man</a>
      <div class="powered-by">
        <img src="/images/logo-white.png" alt="logo" class="logo">
        RubyGems.Guide
      </div>
    </h1>
    <div class="guides" data-controller="nav" style="visibility: hidden;">
      {% include rest-man/nav-guide-item.md url="/rest-man/request/get" name="GET" %}
      {% include rest-man/nav-guide-item.md url="/rest-man/request/post" name="POST" %}
      {% include rest-man/nav-guide-item.md url="/rest-man/request/put" name="PUT" %}
      {% include rest-man/nav-guide-item.md url="/rest-man/request/patch" name="PATCH" %}
      {% include rest-man/nav-guide-item.md url="/rest-man/request/delete" name="DELETE" %}
      {% include rest-man/nav-guide-item.md url="/rest-man/request/options" name="OPTIONS" %}
      {% include rest-man/nav-guide-item.md url="/rest-man/request/head" name="HEAD" %}
      <div class="basic">Basic</div>
      {% include rest-man/nav-guide-item.md url="/rest-man/headers" name="Headers" %}
      {% include rest-man/nav-guide-item.md url="/rest-man/cookies" name="Cookies" %}
      {% include rest-man/nav-guide-item.md url="/rest-man/body" name="Body" %}
      {% include rest-man/nav-guide-item.md url="/rest-man/http-status" name="Status" %}
      <div class="advance">Advance</div>
      {% include rest-man/nav-guide-item.md url="/rest-man/ssl-tls" name="SSL/TLS" %}
      {% include rest-man/nav-guide-item.md url="/rest-man/retry" name="Retry" %}
      {% include rest-man/nav-guide-item.md url="/rest-man/timeout" name="Timeout" %}
      {% include rest-man/nav-guide-item.md url="/rest-man/proxy" name="Proxy" %}
      {% include rest-man/nav-guide-item.md url="/rest-man/redirection" name="Redirection" %}
      {% include rest-man/nav-guide-item.md url="/rest-man/exception" name="Exception" %}
      {% include rest-man/nav-guide-item.md url="/rest-man/logging" name="Logging" %}
      {% include rest-man/nav-guide-item.md url="/rest-man/streaming" name="Streaming" %}
    </div>
    <div class="footer">
      <a href="https://twitter.com/hoppergeegee" target="_blank" class="twitter">
        <img src="/images/social/twitter.png" alt="twitter">
      </a>
      <a href="https://github.com/rubygemsguide/rubygemsguide" target="_blank" class="github">
        <img src="/images/social/github.png" alt="github">
      </a>
    </div>
  </nav>

  <main>
    {{ content }}
  </main>

  {% include analytics.html %}

</body>

</html>

