// /assets/javascript/seamlessNav.js

$(function () {

  /** Re-init any plugins after AJAX content is injected */
  function initPage() {

    // ✅ Feather icons
    if (typeof feather !== "undefined") {
      try {
        feather.replace();
      } catch (e) {}
    }

    // ✅ Bootstrap tooltips & popovers
    if (typeof bootstrap !== "undefined") {
      document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => {
        new bootstrap.Tooltip(el);
      });
      document.querySelectorAll('[data-bs-toggle="popover"]').forEach(el => {
        new bootstrap.Popover(el);
      });
    }

    // ✅ Select2
    if ($.fn && $.fn.select2) {
      $("select[data-control='select2']").each(function () {
        const $select = $(this);

        if ($select.data("select2")) {
          $select.select2("destroy");
        }

        $select.select2({
          width: "100%",
          dropdownParent: $select.parent()
        });
      });
    }

    // ✅ Datepicker (jQuery UI / Bootstrap Datepicker)
    if ($.fn && $.fn.datepicker) {
      $("[data-control='datepicker']").each(function () {
        const $input = $(this);

        if ($input.data("datepicker")) {
          $input.datepicker("destroy");
        }

        $input.datepicker({
          autoclose: true,
          todayHighlight: true,
          format: "yyyy-mm-dd"
        });
      });
    }

    // ✅ Flatpickr (modern date/time picker)
    if (typeof flatpickr !== "undefined") {
      document.querySelectorAll("[data-control='flatpickr']").forEach(el => {
        if (el._flatpickr) {
          el._flatpickr.destroy();
        }
        flatpickr(el, {
          dateFormat: "Y-m-d",
          allowInput: true,
          altInput: true,
          altFormat: "F j, Y"
        });
      });
    }

    // ✅ DataTables
    if ($.fn && $.fn.DataTable) {
      $("table[data-datatable]").each(function () {
        const $table = $(this);

        if ($.fn.DataTable.isDataTable($table)) {
          $table.DataTable().destroy();
        }

        const opts = {
          responsive: true,
          lengthChange: true,
          autoWidth: false,
          buttons: ["copy", "excel", "pdf", "print", "colvis"]
        };

        if ($table.data("datatable") === "simple") {
          delete opts.buttons;
        }

        const dt = $table.DataTable(opts);

        if (opts.buttons) {
          dt.buttons().container()
            .appendTo($table.closest(".dataTables_wrapper").find(".col-md-6:eq(0)"));
        }
      });
    }

    // ✅ SweetAlert2 demo binding (for templates using it)
    if (typeof Swal !== "undefined") {
      $("[data-confirm]").off("click").on("click", function (e) {
        e.preventDefault();
        const msg = $(this).data("confirm") || "Are you sure?";
        const href = $(this).attr("href");

        Swal.fire({
          title: "Please Confirm",
          text: msg,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "Cancel"
        }).then(result => {
          if (result.isConfirmed && href) {
            window.location.href = href;
          }
        });
      });
    }

  }

  /** * Execute inline <script> tags in returned HTML */

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

  /** * Intercept internal links*/
  
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
