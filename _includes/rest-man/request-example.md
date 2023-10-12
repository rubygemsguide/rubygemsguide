{% assign index = include.index %}
{% assign title = include.example.title %}
{% assign pre_desc = include.example.pre_desc %}
{% assign request = include.example.request %}
{% assign response = include.example.response %}
{% assign redirection_request = include.example.redirection_request %}
{% assign redirection_response = include.example.redirection_response %}
{% assign codes = include.example.codes %}

<div class="example-section" id="example-{{ index }}">
  <h3 class="example-title">{{title}}</h3>
  {% if pre_desc %}
    <div class="example-pre-desc">{{pre_desc | markdownify}}</div>
  {% endif %}

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
    {% if request.proxy %}
      <div class="request-proxy">proxy</div>
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

  {% if redirection_request %}
    <div class="redirection-request-box">
      <div class="http-method">{{ redirection_request.http_method }}</div>
      <div class="request-target">{{ redirection_request.request_target }}</div>
      <div class="http-version">{{ redirection_request.http_version }}</div>
      <div class="http-headers">
        {% for header in redirection_request.http_headers %}
          <div class="http-header" title="{{ header }}">{{ header }}</div>
        {% endfor %}
      </div>
      {% if redirection_request.http_body %}
        <div class="http-body">{{ redirection_request.http_body | escape }}</div>
      {% endif %}
    </div>

    <div class="redirection-request-arrow">
      {% include rest-man/arrow-right.html %}
      {% if redirection_request.https %}
        <div class="request-https">
          <img src="/images/posts/rest-man/https.svg" class="https-icon">
          <img src="/images/posts/rest-man/lock.svg" class="https-lock-icon">
        </div>
      {% endif %}
      {% if redirection_request.proxy %}
        <div class="request-proxy">proxy</div>
      {% endif %}
    </div>

    <div class="redirection-response-box">
      <div class="http-version">{{ redirection_response.http_version }}</div>
      <div class="status-code">{{ redirection_response.status_code }}</div>
      <div class="status-text">{{ redirection_response.status_text }}</div>
      <div class="http-headers">
        {% for header in redirection_response.http_headers %}
          <div class="http-header" title="{{ header }}">{{ header }}</div>
        {% endfor %}
      </div>
      {% if redirection_response.http_body %}
        <div class="http-body">{{ redirection_response.http_body | escape }}</div>
      {% endif %}
    </div>
  {% endif %}

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