$(function () { 

    /*  delegated AJAX POST handler for adding/registering staff */
    $(document).on('submit', '.ajaxRegisterStaff', function (e) {
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

                $('#registerStaffModal').modal('hide');
                
                if (response.success) {

                     let staffTable = '';

                     for (let i = 0; i < response.users.length; i++) {

                        staffTable += '<tr>'+
                                            '<td>'+ response.users[i].firstname +'</td>'+
                                            '<td>'+ response.users[i].surname +'</td>'+
                                            '<td>'+ response.users[i].phone +'</td>'+
                                            '<td>'+ response.users[i].email +'</td>'+
                                            '<td>'+
                                                    '<div class="d-flex flex-wrap gap-2">'+
                                                         '<button type="button" data-id="'+ response.users[i].id +'" class="btn btn-warning ajaxGetStaff" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="warning-tooltip" data-bs-title="Edit"><i class="mdi mdi-tooltip-edit"></i></button>'+
                                                         '<button type="button" data-id="'+ response.users[i].id +'" class="btn btn-sm btn-danger ajaxBlockUser" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="danger-tooltip" data-bs-title="Block Staff"><i class="bi bi-person-lock"></i></button>'+
                                                         
                                                    '</div>'+
                                            '</td>'+
                                        '</tr>';
                     }
                     $(".staffHere").html(staffTable);
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

                $('#registerStaffModal').modal('hide');

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
    /* END of delegated AJAX POST handler for adding/registering staff */

    // Handle staff edit modal
    $(document).on('click', '.ajaxGetUser', function () {
        
        const id = $(this).data('id');
        const $modal = $('#editStaffModal');
        const $form  = $modal.find('.ajaxUpdateStaff');

        $.ajax({
            url: '/api/boss/edit/staff/' + id,
            method: 'GET',
            headers: { 'X-Requested-With': 'XMLHttpRequest' },

            success: function (res) {

                if (!res.success) {
                            alert('Not found');
                            $modal.modal('hide');
                            return;
                }

                $form.attr('action', '/api/boss/staff/update/' + id);
                $form.find('input[name="firstname"]').val(res.staff.firstname);
                $form.find('input[name="surname"]').val(res.staff.surname);
                $form.find('input[name="email"]').val(res.staff.email);
                $form.find('input[name="phone"]').val(res.staff.phone);
                $modal.modal('show');
            },

            error: function () {
                alert('Failed to fetch details.');
                $modal.modal('hide');
            }
        });
    });
    // end of edit service


  /*  delegated AJAX POST handler for updating staff */
    $(document).on('submit', '.ajaxUpdateStaff', function (e) {
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

                $('#editStaffModal').modal('hide');
                
                if (response.success) {

                     let staffTable = '';

                     for (let i = 0; i < response.users.length; i++) {

                        staffTable += '<tr>'+
                                            '<td>'+ response.users[i].firstname +' '+ response.users[i].surname +'</td>'+
                                            '<td>'+ response.users[i].email +'</td>'+
                                            '<td>'+ response.users[i].phone +'</td>'+
                                            '<td>'+
                                                    '<div class="d-flex flex-wrap gap-2">'+
                                                         '<button type="button" data-id="'+ response.users[i].id +'" class="btn btn-warning ajaxGetUser" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="warning-tooltip" data-bs-title="Edit"><i class="mdi mdi-tooltip-edit"></i></button>'+
                                                         '<button type="button" data-id="'+ response.users[i].id +'" class="btn btn-sm btn-danger ajaxBlockUser" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="danger-tooltip" data-bs-title="Block Staff"><i class="bi bi-person-lock"></i></button>'+
                                                    '</div>'+
                                            '</td>'+
                                        '</tr>';
                     }
                     $(".staffHere").html(staffTable);
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

                $('#editStaffModal').modal('hide');

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
    /* END of delegated AJAX POST handler for updating staff */

});