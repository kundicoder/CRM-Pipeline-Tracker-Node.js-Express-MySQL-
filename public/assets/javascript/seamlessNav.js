// /assets/javascript/seamless-nav.js

$(function () {
  /**
   * Re-init any plugins after AJAX content is injected
   */
  function initPage() {
    if (typeof feather !== "undefined") {
      try {
        feather.replace();
      } catch (e) {}
    }
    // Rebind other UI handlers here if needed
  }

  /**
   * Execute inline <script> tags in returned HTML
   */
  function executeInlineScripts(html) {
    var tmp = document.createElement("div");
    tmp.innerHTML = html;
    var scripts = tmp.querySelectorAll("script");

    scripts.forEach(function (s) {
      var newScript = document.createElement("script");

      if (s.src) {
        // external script → only append if not already loaded
        if (!$("script[src='" + s.src + "']").length) {
          newScript.src = s.src;
          if (s.type) newScript.type = s.type;
          document.body.appendChild(newScript);
        }
      } else {
        // inline script
        if (s.type && s.type.toLowerCase() === "module") {
          newScript.type = "module";
        }
        newScript.text = s.innerHTML;
        document.body.appendChild(newScript);
        document.body.removeChild(newScript);
      }
    });
  }

  /**
   * Load page via AJAX
   * Backend may return:
   *   - JSON { html, target, url }
   *   - Full HTML (logout, error, etc.)
   */
  function loadPage(url, options = {}) {
    var push = options.push !== false;

    $.ajax({
      url: url,
      method: "GET",
      headers: { "X-Requested-With": "XMLHttpRequest" },

      success: function (response) {

        if (typeof response === "object" && response.html !== undefined) {
          // JSON mode
          var target = response.target || $("body").data("container") || "content";
          var html = response.html;

          var $container = $("#" + target);

          if ($container.length) {

              $container.html(html);

          } else {

            // fallback if container not found
            $("body").html(html);

          }

          executeInlineScripts(html);
          initPage();

          if (push) {
            var newUrl = response.url || url;
            history.pushState({ ajax: true, url: newUrl }, "", newUrl);
          }

        } else {
              // Received full HTML (logout, error page, etc.)
              $("body").html(response);

              if (push) {
                     history.pushState({ ajax: false, url: url }, "", url);
                  }
              }
      },

      error: function () {
        console.error("AJAX navigation failed. Falling back to full reload.");
        window.location.href = url;
      },
    });
  }

  /**
   * Intercept internal links
   */
  $(document).on("click", "a", function (e) {
    var $a = $(this);
    var href = $a.attr("href");

    if (!href) return;
    
    // Skip logout explicitly
    if ($a.attr("href") === "/logout") return;
    
    // skip anchors, js, external, download, _blank, data-no-ajax
    if (
      href.startsWith("#") ||
      href.startsWith("javascript:") ||
      $a.attr("target") === "_blank" ||
      $a.attr("download") ||
      $a.data("no-ajax") ||
      $a.attr("rel") === "external"
    ) {
      return;
    }

    // Ensure internal link
    var linkOrigin = new URL(href, window.location.origin).origin;
    if (linkOrigin !== window.location.origin) return;

    // prevent normal navigation
    e.preventDefault();
    loadPage(href);
  });

  /**
   * Handle back/forward
   */
  window.addEventListener("popstate", function (e) {
    var url = (e.state && e.state.url) || location.pathname + location.search;
    loadPage(url, { push: false });
  });

  // init first page
  initPage();
});
