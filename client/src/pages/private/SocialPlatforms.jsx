import React, { Fragment, useEffect } from "react";
import { apiEndpoints } from "../../api";
import { useForm, useFieldArray } from "react-hook-form";
import LabelInput from "../../components/ui/LabelInput";
import CustomInput from "../../components/ui/CustomInput";
import useVisibilities from "../../hooks/useVisibilities";
import CustomRadioButtons from "../../components/ui/CustomRadioButtons";
import { Trash2 } from "lucide-react";

export default function SocialPlatforms() {
  const { visibilities } = useVisibilities();

  const {
    register,
    handleSubmit,
    reset,
    control,

    formState: { errors, isSubmitting },
  } = useForm();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "socialPlatforms",
  });

  const fetchUserSocialPlatforms = async () => {
    try {
      const res = await apiEndpoints.getUserSocialPlatforms();

      const data = res.data;

      reset({ socialPlatforms: data });
      console.log("User Social Platforms: ", data);
    } catch (error) {
      console.error("Error fetching User Social Platforms: ", error);
    }
  };

  const onSubmit = async (data) => {
    try {
      await apiEndpoints.manageUserSocialPlatforms({
        platforms: data?.socialPlatforms,
      });
      fetchUserSocialPlatforms();
    } catch (error) {
      console.error("Error updating User Social Platforms: ", error);
    }
  };

  const deleteSocialAccount = async (id) => {
    try {
      await apiEndpoints.deleteUserSocialPlatform(id);

      fetchUserSocialPlatforms();
    } catch (error) {
      console.error("Error deleting Social Account: ", error);
    }
  };

  useEffect(() => {
    fetchUserSocialPlatforms();
  }, []);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-12 gap-6 p-3 text-sm border-b border-gray-500"
    >
      {fields.map((item, index) => (
        <div key={item._id} className="col-span-12 grid grid-cols-12 gap-6">
          <LabelInput
            id={`socialPlatforms.${index}.name`}
            label="Platform Name"
            colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
            required
          >
            <CustomInput
              id={`socialPlatforms.${index}.name`}
              type="text"
              placeholder={`Enter Platform name`}
              {...register(`socialPlatforms.${index}.name`)}
              error={errors.socialPlatforms?.[index]?.name}
            />
          </LabelInput>

          <LabelInput
            id={`socialPlatforms.${index}.link`}
            label="Link"
            colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
            required
          >
            <CustomInput
              id={`socialPlatforms.${index}.link`}
              type="text"
              placeholder={`Enter ${item.name} link`}
              {...register(`socialPlatforms.${index}.link`)}
              error={errors.socialPlatforms?.[index]?.link}
            />
          </LabelInput>

          <LabelInput
            id={`socialPlatforms.${index}.sortOrder`}
            label="Sort Order"
            colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
          >
            <CustomInput
              id={`socialPlatforms.${index}.sortOrder`}
              type="number"
              min={0}
              placeholder="{`Enter ${item.name} Sort Order`}"
              {...register(`socialPlatforms.${index}.sortOrder`, { min: 0 })}
              error={errors.socialPlatforms?.[index]?.sortOrder}
            />
          </LabelInput>

          <div className="col-span-12 sm:col-span-6 lg:col-span-3 flex items-start gap-12">
            <LabelInput
              id={`socialPlatforms.${index}.visibility`}
              label="Visibility"
              required
            >
              <CustomRadioButtons
                id={`socialPlatforms.${index}.visibility`}
                name="visibility"
                options={visibilities}
                {...register(`socialPlatforms.${index}.visibility`, {
                  required: "Visibility is required!",
                })}
                error={errors.socialPlatforms?.[index]?.visibility}
              />
            </LabelInput>

            <button
              type="button"
              onClick={() =>
                item._id ? deleteSocialAccount(item._id) : remove(index)
              }
              className="self-end mb-1 p-2 w-fit text-white bg-red-500 hover:bg-red-600 rounded"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}

      <div className="col-span-12 flex items-center gap-3">
        <button
          onClick={() =>
            append({
              name: "",
              link: "",
              visibility: "public", // or default value
              sortOrder: 0,
            })
          }
          className="px-5 py-2 text-white bg-green-500 rounded-sm"
        >
          Add One
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2 justify-end text-white bg-blue-500 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? "Saving" : "Save"}
        </button>
      </div>
    </form>
  );
}
