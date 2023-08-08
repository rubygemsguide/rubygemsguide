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

  {% include custom_css.html %}

  {% seo %}
</head>

<body>

  <nav class="sidebar">
    <h1>
      <a href="/" class="rest-man">rest-man</a>
      <div class="powered-by">
        <img src="/images/logo-white.png" alt="logo" class="logo">
        RubyGems.Guide
      </div>
    </h1>
    <div class="guides">
      <a href="/rest-man/request/get" class="guide">GET</a>
      <a href="/rest-man/request/post" class="guide">POST</a>
      <a href="/rest-man/request/put" class="guide">PUT</a>
      <a href="/rest-man/request/patch" class="guide">PATCH</a>
      <a href="/rest-man/request/delete" class="guide">DELETE</a>
      <a href="/rest-man/request/options" class="guide">OPTIONS</a>
      <a href="/rest-man/request/head" class="guide">HEAD</a>
      <div class="advance">Advance</div>
      <a href="/rest-man/advance/ssl-tls" class="guide">SSL/TLS</a>
      <a href="/rest-man/advance/retry" class="guide">Retry</a>
      <a href="/rest-man/advance/timeouts" class="guide">Timeouts</a>
      <a href="/rest-man/advance/proxy" class="guide">Proxy</a>
      <a href="/rest-man/advance/redirection" class="guide">Redirection</a>
      <a href="/rest-man/advance/exception" class="guide">Exception</a>
      <a href="/rest-man/advance/logging" class="guide">Logging</a>
      <a href="/rest-man/advance/streaming" class="guide">Streaming</a>
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

