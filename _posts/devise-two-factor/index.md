---
layout: post
title: devise-two-factor 
author: Hopper Gee
categories: devise-two-factor
permalink: /devise-two-factor
---

<ul>
  {% for doc in site.categories["devise-two-factor"] %}
    {% if doc.id != "/index" %}
      <li>
        <a href="{{ doc.url }}">{{ doc.title }}</a>
      </li>
    {% endif %}
  {% endfor %}
</ul>