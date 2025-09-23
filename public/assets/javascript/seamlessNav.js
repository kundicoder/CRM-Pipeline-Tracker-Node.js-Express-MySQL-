// /assets/javascript/seamless-nav.js

$(function () {


//SUBMIT HANDLERS

// 🔹 Delegated AJAX POST handler for all forms with class .ajaxForm
//HOW TO USE example: 
// <form id="addRoleForm" class="ajaxForm" action="/api/mct/register-roles" method="POST" data-refresh-table="rolesTable">
// 1. Add .ajaxForm class to all forms you want to submit via AJAX:
// 2. Data attribute for table auto-refresh: data-refresh-table="rolesTable" tells the global handler which table to reload after successful AJAX submission.
// 3. Modal handling: The script will automatically hide the modal containing the form.
// 4. Button spinner & disable: Automatically handled using beforeSend and restored after success/error.

$(document).off("submit", ".ajaxForm").on("submit", ".ajaxForm", function(e) {

    e.preventDefault();
    let $form = $(this);
    let formData = $form.serialize();
    let submitBtn = $form.find("[type='submit']");
    let defaultBtnText = submitBtn.text();

    $.ajax({
        url: $form.attr("action"),
        method: $form.attr("method") || "POST",
        data: formData,
        headers: { "X-Requested-With": "XMLHttpRequest" },
        dataType: "json",

        beforeSend: function() {
            submitBtn.html(`<span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span> Please wait...`).prop("disabled", true);
        },

        success: function(response) {
            submitBtn.html(defaultBtnText).prop("disabled", false);

            // Hide any modal containing the form
            $form.closest(".modal").modal("hide");

            if (response.success) {
                // Show success modal
                $("#successAlertModal .mt-2").text(response.message || "Operation successful.");
                $("#successAlertModal").modal("show");

                // Reset form
                $form[0].reset();

                // Auto-refresh DataTables if any
                let tableId = $form.data("refresh-table");
                if (tableId && $.fn.DataTable && $("#" + tableId).length) {
                    $("#" + tableId).DataTable().ajax.reload(null, false);
                }

            } else {
                // Show errors
                const errors = Array.isArray(response.errors) ? response.errors : [response.error || "Something went wrong"];
                $("#displayErrorsHere").html(errors.join("<br>"));
                $("#warningAlertModal").modal("show");
            }
        },

        error: function(xhr) {
            submitBtn.html(defaultBtnText).prop("disabled", false);
            $form.closest(".modal").modal("hide");

            let errors = [];
            try {
                const res = JSON.parse(xhr.responseText);
                errors = Array.isArray(res.errors) ? res.errors : [res.error || "Unexpected error occurred"];
            } catch (e) {
                errors = ["Unexpected error occurred"];
            }

            $("#displayErrorsHere").html(errors.join("<br>"));
            $("#warningAlertModal").modal("show");
        }
    });
}); //END ajax POST handler

// 🔹 Delegated AJAX GET handler
$(document).off("click", ".ajaxGet").on("click", ".ajaxGet", function(e) {
    e.preventDefault();
    let $el = $(this);
    let url = $el.attr("href") || $el.data("url");
    let targetId = $el.data("target") || "content";

    if (!url) return;

    $.ajax({
        url: url,
        method: "GET",
        headers: { "X-Requested-With": "XMLHttpRequest" },
        dataType: "html",

        beforeSend: function() {
            $el.prop("disabled", true).addClass("loading");
        },

        success: function(response) {
            $("#" + targetId).html(response);
            $el.prop("disabled", false).removeClass("loading");
            initPage(); // re-init plugins for new content
            executeInlineScripts(response);
        },

        error: function(xhr) {
            $el.prop("disabled", false).removeClass("loading");
            console.error("AJAX GET failed:", xhr.status, xhr.statusText);
        }
    });
});
  //HOW TO USE
  // 1. <a href="/mct/roles" class="ajaxGet" data-target="content">Roles</a>
  // 2. <button class="ajaxGet" data-url="/mct/roles" data-target="content">Load Roles</button>
  
  // GETTING DATA BY ID/perimeter

  // Example how to do it!!!!
  // <a href="/mct/roles/2/edit"
  //  class="ajaxGet"
  //  data-target="roleEditModalBody" #roleEditModalBody = <div> inside the modal where AJAX GET will inject the partial form.
  //  data-toggle="modal"
  //  data-bs-target="#roleEditModal"> #roleEditModal = Bootstrap modal wrapper.
  // Edit</a>
  
  // **NB**
  // data-target → where to inject the partial HTML
  // data-bs-toggle="modal" and data-bs-target="#roleEditModal" → tells Bootstrap to open the modal.

  // The flow:
  // 1. User clicks Edit → .ajaxGet loads /mct/roles/2/edit (controller returns the form partial).
  // 2. Response HTML is injected into #roleEditModalBody.
  // 3. Modal pops up automatically because data-bs-target="#roleEditModal" triggers it.

  //HOW TO HANDLE IN CONTROLLER?
  //   EXAMPLE
  //   editRole: async (req, res) => {
  //   const { id } = req.params;
  //   const [rows] = await db.query("SELECT * FROM roles WHERE id = ?", [id]);
  //   const role = rows[0];

  //   if (!role) {
  //     if (req.xhr) return res.status(404).send("Role not found");
  //     req.flash("error_msg", "Role not found");
  //     return res.redirect("/mct/roles"); replace with your_route_url
  //   }

  //   return res.render("partials/mct/editRoleForm", { role }); replace with your any_partial_name
  // }

  // #roleEditModal = Bootstrap modal wrapper.
  // #roleEditModalBody = <div> inside the modal where AJAX GET will inject the partial form.

  //END SUBMIT HANDLER

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
