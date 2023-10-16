---
layout: rest-man/post
title:  RubyGems.Guide | rest-man | Headers
author: Hopper Gee
categories: rest-man
permalink: /rest-man/basic/headers
---

<div class="post">
  <h2 class="title">Headers</h2>

  {% if site.data.rest_man.headers.description %}
    <div class="post-desc">
      {{site.data.rest_man.headers.description | markdownify}}
    </div>
  {% endif %}

  {% for example in site.data.rest_man.headers.examples %}
    {% include rest-man/request-example.md example=example index=forloop.index %}
  {% endfor %}
</div>
