---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults
title: RubyGems.Guide
layout: home
image: /images/rubygems.guide.png
custom_css: home
---

<ul>
  {% for post in site.posts limit: 20 %}
    <li>
      <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
  {% endfor %}
</ul>