---
layout: rest-man/post
title:  RubyGems.Guide | rest-man | Cookies
author: Hopper Gee
categories: rest-man
permalink: /rest-man/cookies
---

<div class="post">
  <h2 class="title">Cookies</h2>

  {% if site.data.rest_man.cookies.description %}
    <div class="post-desc">
      {{site.data.rest_man.cookies.description | markdownify}}
    </div>
  {% endif %}

  {% for example in site.data.rest_man.cookies.examples %}
    {% include rest-man/request-example.md example=example index=forloop.index %}
  {% endfor %}
</div>
