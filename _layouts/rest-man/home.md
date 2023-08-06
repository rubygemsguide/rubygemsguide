---
---
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ page.title }}</title>

  {% include favicon.html %}

  <link rel="stylesheet" href="/css/{{ 'rest-man/home.css' | bust_css_cache }}">

  {% include custom_css.html %}

  {% seo %}
</head>

<body class="home">

  <header>
    <h1>
      <a href="/" class="brand">
        <img src="/images/logo-white.png" alt="logo" class="logo">
        RubyGems.Guide
      </a>
    </h1>
    <h2>
      rest-man
    </h2>
  </header>

  <main>
    {{ content }}
  </main>

  {% include footer.html %}
  {% include analytics.html %}

</body>

</html>

