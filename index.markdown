---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults
title: RubyGems.Guide
layout: home
image: /images/rubygems.guide.png
custom_css: home
---

<ul>
  {% for category in site.categories %}
    <li>
      <a href="/{{ category | first }}">{{ category | first }}</a>
    </li>
  {% endfor %}
</ul>
