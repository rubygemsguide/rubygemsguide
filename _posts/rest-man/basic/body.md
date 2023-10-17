---
layout: rest-man/post
title:  RubyGems.Guide | rest-man | Body
author: Hopper Gee
categories: rest-man
permalink: /rest-man/body
---

<div class="post">
  <h2 class="title">Body</h2>

  {% if site.data.rest_man.body.description %}
    <div class="post-desc">
      {{site.data.rest_man.body.description | markdownify}}
    </div>
  {% endif %}

  {% for example in site.data.rest_man.body.examples %}
    {% include rest-man/request-example.md example=example index=forloop.index %}
  {% endfor %}
</div>
