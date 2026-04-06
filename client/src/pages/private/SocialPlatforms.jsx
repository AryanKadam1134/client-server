import React, { Fragment, useEffect } from "react";

import { useForm, useFieldArray } from "react-hook-form";
import { Plus, Trash2, ExternalLink } from "lucide-react";

import LabelInput from "../../components/ui/LabelInput";
import CustomInput from "../../components/ui/CustomInput";
import CustomButton from "../../components/ui/CustomButton";
import CustomSelect from "../../components/ui/CustomSelect";
import CustomRadioButtons from "../../components/ui/CustomRadioButtons";

import { apiEndpoints } from "../../api";

import useVisibilities from "../../hooks/useVisibilities";

const SOCIAL_APPS_LIST = [
  {
    id: 61,
    title: "Facebook",
    category: "Social",
    route: "https://svgl.app/library/facebook-icon.svg",
    wordmark: "https://svgl.app/library/facebook-wordmark.svg",
    url: "https://www.facebook.com",
    brandUrl: "https://about.meta.com/brand/resources/facebook/logo",
  },
  {
    id: 62,
    title: "Twitter",
    category: "Social",
    route: "https://svgl.app/library/twitter.svg",
    url: "https://twitter.com/",
  },
  {
    id: 78,
    title: "YouTube",
    category: ["Google", "Social"],
    route: "https://svgl.app/library/youtube.svg",
    wordmark: {
      light: "https://svgl.app/library/youtube-wordmark-light.svg",
      dark: "https://svgl.app/library/youtube-wordmark-dark.svg",
    },
    url: "https://www.youtube.com",
    brandUrl: "https://brand.youtube",
  },
  {
    id: 85,
    title: "LinkedIn",
    category: "Social",
    route: "https://svgl.app/library/linkedin.svg",
    url: "https://www.linkedin.com/",
    brandUrl: "https://brand.linkedin.com/",
  },
  {
    id: 86,
    title: "Telegram",
    category: "Social",
    route: "https://svgl.app/library/telegram.svg",
    url: "https://web.telegram.org/",
  },
  {
    id: 87,
    title: "Matrix",
    category: "Social",
    route: {
      light: "https://svgl.app/library/matrix-light.svg",
      dark: "https://svgl.app/library/matrix-dark.svg",
    },
    url: "https://matrix.org/",
  },
  {
    id: 88,
    title: "WhatsApp",
    category: "Social",
    route: "https://svgl.app/library/whatsapp-icon.svg",
    wordmark: "https://svgl.app/library/whatsapp-wordmark.svg",
    url: "https://web.whatsapp.com",
    brandUrl: "https://www.meta.com/brand/resources/whatsapp/whatsapp-brand",
  },
  {
    id: 110,
    title: "Arc",
    category: "Social",
    route: {
      light: "https://svgl.app/library/arc.svg",
      dark: "https://svgl.app/library/arc_dark.svg",
    },
    url: "https://arc.dev",
  },
  {
    id: 215,
    title: "Mastodon",
    category: "Social",
    route: "https://svgl.app/library/mastodon.svg",
    url: "https://joinmastodon.org/",
  },
  {
    id: 229,
    title: "Messenger",
    category: "Social",
    route: "https://svgl.app/library/messenger.svg",
    url: "https://www.messenger.com/",
  },
  {
    id: 248,
    title: "Infojobs",
    category: "Social",
    route: "https://svgl.app/library/infojobs-logo.svg",
    url: "https://www.infojobs.net/",
  },
  {
    id: 252,
    title: "Skype",
    category: "Social",
    route: "https://svgl.app/library/skype.svg",
    url: "https://www.skype.com/",
  },
  {
    id: 261,
    title: "Threads",
    category: "Social",
    route: {
      light: "https://svgl.app/library/threads.svg",
      dark: "https://svgl.app/library/threads_dark.svg",
    },
    url: "https://threads.net/",
  },
  {
    id: 262,
    title: "Instagram",
    category: "Social",
    route: "https://svgl.app/library/instagram-icon.svg",
    wordmark: "https://svgl.app/library/instagram-wordmark.svg",
    url: "https://www.instagram.com/",
    brandUrl: "https://about.instagram.com/brand",
  },
  {
    id: 284,
    title: "X (formerly Twitter)",
    category: "Social",
    route: {
      light: "https://svgl.app/library/x.svg",
      dark: "https://svgl.app/library/x_dark.svg",
    },
    url: "https://x.com",
    brandUrl: "https://about.x.com/en/who-we-are/brand-toolkit",
  },
  {
    id: 293,
    title: "VK",
    category: "Social",
    route: "https://svgl.app/library/vk.svg",
    url: "https://vk.com",
  },
  {
    id: 313,
    title: "Hashnode",
    category: "Social",
    route: "https://svgl.app/library/hashnode.svg",
    url: "https://hashnode.com",
  },
  {
    id: 317,
    title: "Patreon",
    category: "Social",
    route: {
      light: "https://svgl.app/library/patreon.svg",
      dark: "https://svgl.app/library/patreon_dark.svg",
    },
    url: "https://www.patreon.com/",
  },
  {
    id: 318,
    title: "Peerlist",
    category: "Social",
    route: "https://svgl.app/library/peerlist.svg",
    url: "https://www.peerlist.io/",
  },
  {
    id: 343,
    title: "Pinterest",
    category: "Social",
    route: "https://svgl.app/library/pinterest.svg",
    url: "https://pinterest.com/",
  },
  {
    id: 353,
    title: "Reddit",
    category: "Social",
    route: "https://svgl.app/library/reddit.svg",
    url: "https://www.reddit.com/",
    brandUrl: "https://redditinc.com/brand",
  },
  {
    id: 404,
    title: "Meta",
    category: "Social",
    route: "https://svgl.app/library/meta.svg",
    url: "https://about.meta.com/es/",
    brandUrl: "https://about.meta.com/brand/resources/",
  },
  {
    id: 426,
    title: "TikTok",
    category: "Social",
    route: {
      light: "https://svgl.app/library/tiktok-icon-light.svg",
      dark: "https://svgl.app/library/tiktok-icon-dark.svg",
    },
    wordmark: {
      light: "https://svgl.app/library/tiktok-wordmark-light.svg",
      dark: "https://svgl.app/library/tiktok-wordmark-dark.svg",
    },
    url: "https://www.tiktok.com",
  },
  {
    id: 471,
    title: "Carrd",
    category: ["Social"],
    route: "https://svgl.app/library/carrd.svg",
    url: "https://carrd.co/",
  },
  {
    id: 475,
    title: "Bluesky",
    category: "Social",
    route: "https://svgl.app/library/bluesky.svg",
    url: "https://blueskyweb.xyz/",
  },
  {
    id: 477,
    title: "daily.dev",
    category: ["Social", "Community"],
    route: {
      light: "https://svgl.app/library/daily-dev-ligth.svg",
      dark: "https://svgl.app/library/daily-dev-dark.svg",
    },
    url: "https://daily.dev/",
  },
  {
    id: 542,
    title: "Zulip",
    category: ["Software", "Social"],
    route: "https://svgl.app/library/zulip.svg",
    wordmark: "https://svgl.app/library/zulip-wordmark.svg",
    url: "https://zulip.com/",
    brandUrl:
      "https://github.com/zulip/zulip/tree/bd29fb3e2691daef570ba5661351922a16782dd2/static/images/logo",
  },
];

const SOCIAL_APPS = SOCIAL_APPS_LIST.map((app) => ({
  value: app.title,
  label: app.title,
}));

export default function SocialPlatforms() {
  const { visibilities } = useVisibilities();

  const {
    register,
    handleSubmit,
    reset,
    control,
    getValues,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "socialPlatforms",
  });

  const fetchSocialPlatforms = async () => {
    try {
      const res = await apiEndpoints.getSocialPlatforms();

      const data = res.data;

      reset({ socialPlatforms: data });
      console.log("User Social Platforms: ", data);
    } catch (error) {
      console.error("Error fetching User Social Platforms: ", error);
    }
  };

  const getUpdatedSocialPlatforms = (data, dirtyFields) => {
    if (!dirtyFields?.socialPlatforms) return [];

    return data.socialPlatforms
      .map((item, index) => {
        const dirty = dirtyFields.socialPlatforms[index];

        if (!dirty) return null; // skip untouched

        const updatedItem = {};

        for (const key in dirty) {
          updatedItem[key] = item[key];
        }

        // always include _id for update
        updatedItem._id = item._id;

        return updatedItem;
      })
      .filter(Boolean); // remove nulls
  };

  const onSubmit = async (data) => {
    const updatedData = getUpdatedSocialPlatforms(data, dirtyFields);

    console.log("Only Updated Fields:", updatedData);

    try {
      await Promise.all(
        updatedData?.map((socialAccount) =>
          apiEndpoints.updateSocialPlatform(socialAccount?._id, socialAccount),
        ),
      );

      fetchSocialPlatforms();
    } catch (error) {
      console.error("Error updating User Social Platforms: ", error);
    }
  };

  const addPlatform = async (payload) => {
    try {
      const res = await apiEndpoints.addSocialPlatform(payload);

      const data = res.data;

      fetchSocialPlatforms();
      console.log("Social Platform Created: ", data);
    } catch (error) {
      console.error("Error creating Social Platform: ", error);
    }
  };

  const updatePlatform = async (payload) => {
    try {
      const res = await apiEndpoints.updateSocialPlatform(
        payload?._id,
        payload,
      );

      const data = res.data;

      fetchSocialPlatforms();
      console.log("Social Platform Updated: ", data);
    } catch (error) {
      console.error("Error updating Social Platform: ", error);
    }
  };

  const deletePlatform = async (id) => {
    try {
      await apiEndpoints.deleteSocialPlatform(id);

      fetchSocialPlatforms();
    } catch (error) {
      console.error("Error deleting Social Account: ", error);
    }
  };

  useEffect(() => {
    fetchSocialPlatforms();
  }, []);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-12 gap-6 text-sm"
    >
      {fields.map((item, index) => (
        <div
          key={item._id || index}
          className="col-span-12 sm:col-span-4 flex flex-col gap-6 p-5 bg-white border border-gray-500 rounded-md shadow-lg"
        >
          {/* Platform Name */}
          <LabelInput
            id={`socialPlatforms.${index}.name`}
            label="Platform Name"
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

          {/* Platform Link */}
          <LabelInput
            id={`socialPlatforms.${index}.link`}
            label="Link"
            attachment={
              item?.link && (
                <a
                  href={item?.link}
                  target="_blank"
                  className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600 cursor-pointer"
                >
                  <ExternalLink size={13} /> <p>Visit Link</p>
                </a>
              )
            }
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

          {/* Sort Order */}
          <LabelInput
            id={`socialPlatforms.${index}.sortOrder`}
            label="Sort Order"
          >
            <CustomInput
              id={`socialPlatforms.${index}.sortOrder`}
              type="number"
              min={0}
              placeholder={`Enter ${item.name} Sort Order`}
              {...register(`socialPlatforms.${index}.sortOrder`, { min: 0 })}
              error={errors.socialPlatforms?.[index]?.sortOrder}
            />
          </LabelInput>

          {/* Visibility & Action Buttons */}
          <div className="flex items-center justify-between gap-2">
            <LabelInput
              id={`socialPlatforms.${index}.visibility`}
              label="Visibility"
              className="flex-1"
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

            <CustomButton
              type="button"
              onClick={() =>
                item._id ? deletePlatform(item._id) : remove(index)
              }
              bg_prop="bg-red-500 hover:bg-red-600"
            >
              Remove
            </CustomButton>

            {/* Add button */}
            {!item._id && (
              <CustomButton
                type="button"
                onClick={() =>
                  addPlatform(getValues(`socialPlatforms.${index}`))
                }
                bg_prop="bg-green-500 hover:bg-green-600"
              >
                Add
              </CustomButton>
            )}

            {/* Update Button */}
            {item._id &&
              dirtyFields?.socialPlatforms?.[index] &&
              Object.values(dirtyFields?.socialPlatforms?.[index])?.some(
                (v) => v,
              ) && (
                <CustomButton
                  type="button"
                  onClick={() =>
                    updatePlatform(getValues(`socialPlatforms.${index}`))
                  }
                  bg_prop="bg-blue-500 hover:bg-blue-600"
                >
                  Update
                </CustomButton>
              )}
          </div>
        </div>
      ))}

      <div className="col-span-4 flex flex-col items-center justify-center gap-3 p-6 bg-white border border-gray-500 rounded-md shadow-lg">
        <div
          onClick={() =>
            append({
              name: "",
              link: "",
              visibility: "public",
              sortOrder: fields?.length,
            })
          }
          className="flex flex-col items-center justify-center gap-1 w-full h-full
        text-gray-600 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md border-2 border-gray-500 border-dashed cursor-pointer transition-colors"
        >
          <Plus size={24} />
          Add Custom Platform <br />
        </div>

        <p>OR</p>

        <LabelInput id="platfrom" label="Select Platfrom" className="w-full">
          <CustomSelect
            placeholder="Select Platfrom"
            options={[
              { value: "Select Platfrom", label: "Select" },
              ...SOCIAL_APPS,
            ]}
            value="Select Platfrom"
            onChange={(value) =>
              append({
                name: value, // ✅ correct
                link: "",
                visibility: "public",
                sortOrder: fields?.length,
              })
            }
          />
        </LabelInput>
      </div>

      <CustomButton
        type="submit"
        className="col-span-12 place-self-end"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Saving..." : "Save"}
      </CustomButton>
    </form>
  );
}
