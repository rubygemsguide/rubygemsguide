---
layout: rest-man/post
title:  RubyGems.Guide | rest-man | Exception
author: Hopper Gee
categories: rest-man
permalink: /rest-man/exception
---

<div class="post">
  <h2 class="title">Exception</h2>

  {% if site.data.rest_man.exception.description %}
    <div class="post-desc">
      {{site.data.rest_man.exception.description | markdownify}}
    </div>
  {% endif %}

  {% for example in site.data.rest_man.exception.examples %}
    {% include rest-man/request-example.md example=example index=forloop.index %}
  {% endfor %}
</div>
