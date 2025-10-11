$(function () { 
    
    /*  delegated AJAX POST handler for adding/registering roles */
    $(document).on('submit', '.ajaxRegisterService', function (e) {
        e.preventDefault();

        const actionUrl  = $(this).attr('action');
        const formData   = $(this).serialize();
        const $submitBtn = $(this).find('[type="submit"]');
        const originalBtnHtml = $submitBtn.html();

        $.ajax({
            url: actionUrl,
            type: 'POST',
            data: formData,
            headers: { 'X-Requested-With': 'XMLHttpRequest' },

            beforeSend: function () {
                $submitBtn.prop('disabled', true)
                          .html('<span class="spinner-border spinner-border-sm me-1"></span> Please wait...');
            },

            success: function (response) {

                $('#registerServiceModal').modal('hide');
                
                if (response.success) {

                     let servicesTable = '';

                     for (let i = 0; i < response.services.length; i++) {

                        servicesTable += '<tr>'+
                                            '<td>'+ response.services[i].name +'</td>'+
                                            '<td>'+
                                                    '<div class="d-flex flex-wrap gap-2">'+
                                                         '<button type="button" data-id="'+ response.services[i].id +'" class="btn btn-warning ajaxGetService" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="warning-tooltip" data-bs-title="Edit"><i class="mdi mdi-tooltip-edit"></i> </button>'+
                                                    '</div>'+
                                            '</td>'+
                                        '</tr>';
                     }
                     $(".servicesHere").html(servicesTable);
                    // Show success modal
                    $("#successAlertModal .mt-2").text(response.message || "Operation successful.");
                    $("#successAlertModal").modal("show");

                } else {
                    // Show errors
                    const errors = Array.isArray(response.errors) ? response.errors : [response.error || "Something went wrong"];
                    $("#displayErrorsHere").html(errors.join("<br>"));
                    $("#warningAlertModal").modal("show");
                }
            },

            error: function (xhr) {

                $('#registerServiceModal').modal('hide');

                let errors = [];

                try {
                        const res = JSON.parse(xhr.responseText);
                        errors = Array.isArray(res.errors) ? res.errors : [res.error || "Unexpected error occurred"];
                    } catch (e) {
                        errors = ["Unexpected error occurred"];
                }

                $("#displayErrorsHere").html(errors.join("<br>"));
                $("#warningAlertModal").modal("show");
            },

             complete: function () {
                // Re-enable submit button & restore original label
                $submitBtn.prop('disabled', false).html(originalBtnHtml);
            }
        });
    });
    /* END of delegated AJAX POST handler for adding/registering service */

    // Handle service edit modal
    $(document).on('click', '.ajaxGetService', function () {
        
        const id = $(this).data('id');
        const $modal = $('#editServiceModal');
        const $form  = $modal.find('.ajaxUpdateService');

        $.ajax({
            url: '/api/boss/edit/service/' + id,
            method: 'GET',
            headers: { 'X-Requested-With': 'XMLHttpRequest' },

            success: function (res) {

                if (!res.success) {
                            alert('Not found');
                            $modal.modal('hide');
                            return;
                }

                $form.attr('action', '/api/boss/service/update/' + id);
                $form.find('input[name="service"]').val(res.service.name);
                $modal.modal('show');
            },

            error: function () {
                alert('Failed to fetch details.');
                $modal.modal('hide');
            }
        });
    });
    // end of edit service

    /*  delegated AJAX POST handler for updating service */
    $(document).on('submit', '.ajaxUpdateService', function (e) {
        e.preventDefault();

        const actionUrl  = $(this).attr('action');
        const formData   = $(this).serialize();
        const $submitBtn = $(this).find('[type="submit"]');
        const originalBtnHtml = $submitBtn.html();

        $.ajax({
            url: actionUrl,
            type: 'POST',
            data: formData,
            headers: { 'X-Requested-With': 'XMLHttpRequest' },

            beforeSend: function () {
                $submitBtn.prop('disabled', true)
                          .html('<span class="spinner-border spinner-border-sm me-1"></span> Please wait...');
            },

            success: function (response) {

                $('#editServiceModal').modal('hide');
                
                if (response.success) {

                     let servicesTable = '';

                     for (let i = 0; i < response.services.length; i++) {

                        servicesTable += '<tr>'+
                                            '<td>'+ response.services[i].name +'</td>'+
                                            '<td>'+
                                                    '<div class="d-flex flex-wrap gap-2">'+
                                                         '<button type="button" data-id="'+ response.services[i].id +'" class="btn btn-warning ajaxGetService" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="warning-tooltip" data-bs-title="Edit"><i class="mdi mdi-tooltip-edit"></i> </button>'+
                                                    '</div>'+
                                            '</td>'+
                                        '</tr>';
                     }
                     $(".servicesHere").html(servicesTable);
                    // Show success modal
                    $("#successAlertModal .mt-2").text(response.message || "Operation successful.");
                    $("#successAlertModal").modal("show");

                } else {
                    // Show errors
                    const errors = Array.isArray(response.errors) ? response.errors : [response.error || "Something went wrong"];
                    $("#displayErrorsHere").html(errors.join("<br>"));
                    $("#warningAlertModal").modal("show");
                }
            },

            error: function (xhr) {

                $('#editServiceModal').modal('hide');

                let errors = [];

                try {
                        const res = JSON.parse(xhr.responseText);
                        errors = Array.isArray(res.errors) ? res.errors : [res.error || "Unexpected error occurred"];
                    } catch (e) {
                        errors = ["Unexpected error occurred"];
                }

                $("#displayErrorsHere").html(errors.join("<br>"));
                $("#warningAlertModal").modal("show");
            },

             complete: function () {
                $submitBtn.prop('disabled', false).html(originalBtnHtml);
            }
        });
    });
    // end of updating
});