{% assign index = include.index %}
{% assign title = include.example.title %}
{% assign request = include.example.request %}
{% assign response = include.example.response %}
{% assign codes = include.example.codes %}

<div class="example-section" id="example-{{ index }}">
  <h3 class="example-title">{{title}}</h3>
  <div class="request-box">
    <div class="http-method">{{ request.http_method }}</div>
    <div class="request-target">{{ request.request_target }}</div>
    <div class="http-version">{{ request.http_version }}</div>
    <div class="http-headers">
      {% for header in request.http_headers %}
        <div class="http-header" title="{{ header }}">{{ header }}</div>
      {% endfor %}
    </div>
    {% if request.http_body %}
      <div class="http-body">{{ request.http_body | escape }}</div>
    {% endif %}
  </div>

  <div class="request-arrow">
    {% include rest-man/arrow-right.html %}
    {% if request.https %}
      <div class="request-https">
        <img src="/images/posts/rest-man/https.svg" class="https-icon">
        <img src="/images/posts/rest-man/lock.svg" class="https-lock-icon">
      </div>
    {% endif %}
  </div>

  <div class="response-box">
    <div class="http-version">{{ response.http_version }}</div>
    <div class="status-code">{{ response.status_code }}</div>
    <div class="status-text">{{ response.status_text }}</div>
    <div class="http-headers">
      {% for header in response.http_headers %}
        <div class="http-header" title="{{ header }}">{{ header }}</div>
      {% endfor %}
    </div>
    {% if response.http_body %}
      <div class="http-body">{{ response.http_body | escape }}</div>
    {% endif %}
  </div>

  <div class="terminal" data-controller="terminal">
    <div class="terminal-bar">
      <div class="close-icon"></div>
      <div class="minimize-icon"></div>
      <div class="fullscreen-icon"></div>
      {% for code in codes %}
        <div
          class="terminal-tab {% if forloop.index == 1 %}active{% endif %}"
          data-index="{{forloop.index}}"
          data-terminal-target="tab"
          data-action="click->terminal#switchTab"
        >
          {{code.tab}}
        </div>
      {% endfor %}
    </div>
    {% for code in codes %}
      <div class="terminal-body {% if forloop.index == 1 %}active{% endif %}" data-index="{{ forloop.index }}" data-terminal-target="body">
        {{code.body | markdownify}}
      </div>
    {% endfor %}
  </div>
</div>