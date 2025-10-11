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
        if ($select.data("select2")) $select.select2("destroy");
        $select.select2({
          width: "100%",
          dropdownParent: $select.parent()
        });
      });
    }

    // ✅ Datepicker
    if ($.fn && $.fn.datepicker) {
      $("[data-control='datepicker']").each(function () {
        const $input = $(this);
        if ($input.data("datepicker")) $input.datepicker("destroy");
        $input.datepicker({
          autoclose: true,
          todayHighlight: true,
          format: "yyyy-mm-dd"
        });
      });
    }

    // ✅ Flatpickr
    if (typeof flatpickr !== "undefined") {
      document.querySelectorAll("[data-control='flatpickr']").forEach(el => {
        if (el._flatpickr) el._flatpickr.destroy();
        flatpickr(el, {
          dateFormat: "Y-m-d",
          allowInput: true,
          altInput: true,
          altFormat: "F j, Y"
        });
      });
    }

    // ✅ DataTables (Universal - Class-based only)
    // NB: use .datatable-buttons or .basic-datatable
    if ($.fn && $.fn.DataTable) {
      $("table").each(function () {
        const $table = $(this);

        // Destroy if already initialized
        if ($.fn.DataTable.isDataTable($table)) {
          $table.DataTable().destroy();
        }

        // Default configuration
        let opts = {
          responsive: true,
          lengthChange: true,
          autoWidth: false
        };

        // --- Detect by Class ---
        if ($table.hasClass("datatable-buttons")) {
          // Full-feature DataTable with export buttons
          opts.buttons = ["copy", "excel", "pdf", "print", "colvis"];
        } else if ($table.hasClass("datatable-basic")) {
          // Simple DataTable, no export buttons
          opts.buttons = [];
        }

        // Initialize
        const dt = $table.DataTable(opts);

        // Append buttons container if exists
        if (opts.buttons && opts.buttons.length) {
          dt.buttons().container()
            .appendTo($table.closest(".dataTables_wrapper").find(".col-md-6:eq(0)"));
        }
      });
    }

    // ✅ SweetAlert2 confirmation handler
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
          if (result.isConfirmed && href) window.location.href = href;
        });
      });
    }

  }

  /** Execute inline <script> tags in returned HTML */
  function executeInlineScripts(html) {
    var tmp = document.createElement("div");
    tmp.innerHTML = html;
    var scripts = tmp.querySelectorAll("script");

    scripts.forEach(function (s) {
      var newScript = document.createElement("script");
      if (s.src) {
        if (!$("script[src='" + s.src + "']").length) {
          newScript.src = s.src;
          if (s.type) newScript.type = s.type;
          document.body.appendChild(newScript);
        }
      } else {
        if (s.type && s.type.toLowerCase() === "module") newScript.type = "module";
        newScript.text = s.innerHTML;
        document.body.appendChild(newScript);
        document.body.removeChild(newScript);
      }
    });
  }

  /** Load page via AJAX */
  function loadPage(url, options = {}) {
    var push = options.push !== false;

    $.ajax({
      url: url,
      method: "GET",
      headers: { "X-Requested-With": "XMLHttpRequest" },
      success: function (response) {

        if (typeof response === "object" && response.html !== undefined) {
          var target = response.target || $("body").data("container") || "content";
          var html = response.html;
          var $container = $("#" + target);

          if ($container.length) {
            $container.html(html);
          } else {
            $("body").html(html);
          }

          executeInlineScripts(html);
          initPage();

          if (push) {
            var newUrl = response.url || url;
            history.pushState({ ajax: true, url: newUrl }, "", newUrl);
          }

        } else {
          $("body").html(response);
          if (push) history.pushState({ ajax: false, url: url }, "", url);
        }
      },
      error: function () {
        console.error("AJAX navigation failed. Falling back to full reload.");
        window.location.href = url;
      },
    });
  }

  /** Intercept internal links */
  $(document).on("click", "a", function (e) {
    var $a = $(this);
    var href = $a.attr("href");
    if (!href) return;

    // Skip logout, external, JS or anchor links
    if (
      href.startsWith("#") ||
      href.startsWith("javascript:") ||
      $a.attr("target") === "_blank" ||
      $a.attr("download") ||
      $a.data("no-ajax") ||
      $a.attr("rel") === "external" ||
      href === "/logout"
    ) return;

    // Ensure internal link
    var linkOrigin = new URL(href, window.location.origin).origin;
    if (linkOrigin !== window.location.origin) return;

    // prevent normal navigation
    e.preventDefault();

    // ✅ highlight ONLY the clicked active link
    $("a.active").removeClass("active");
    $a.addClass("active");

    loadPage(href);
  });

  /** Handle back/forward navigation */
  window.addEventListener("popstate", function (e) {
    var url = (e.state && e.state.url) || location.pathname + location.search;
    loadPage(url, { push: false });
  });

  // init first page
  initPage();
});
