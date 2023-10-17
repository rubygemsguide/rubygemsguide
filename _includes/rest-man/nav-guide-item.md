{% assign url = include.url %}
{% assign name = include.name %}

{% if page.permalink == url %}
  <a href="{{ url }}" class="guide active" data-nav-target="item">{{name}}</a>
{% else %}
  <a href="{{ url }}" class="guide" data-nav-target="item">{{name}}</a>
{% endif %}