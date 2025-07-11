// rnWindowsAIFoundrySample.cpp : Defines the entry point for the application.
//

#include "pch.h"
#include "rnWindowsAIFoundrySample.h"
//#include "winrt/Microsoft.Windows.AI.Generative.h" // Add Windows AI API Header File
#include <../../../codegen/NativeWindowsAIApisModuleSpec.g.h>
#include "winrt/Windows.UI.h"

#include "AutolinkedNativeModules.g.h"

#include "NativeModules.h"

//using namespace winrt::Microsoft::Windows::AI::Generative;

// Native Module for Windows AI APIs
REACT_MODULE(WindowsAIApisModule);
struct WindowsAIApisModule
{
    using ModuleSpec = rnWindowsAIFoundrySampleCodegen::WindowsAIApisModuleSpec;

    // Method to Retrieve Phi Silica Response
    REACT_METHOD(GetPhiSilicaResponse, L"getPhiSilicaResponse");
    void GetPhiSilicaResponse(std::string prompt, React::ReactPromise<std::string> response) noexcept
    {
        response.Resolve("Test Result");
        // Check if Model is Available Locally. If not, install.
        /*if (!LanguageModel::IsAvailable()) {
            auto op = LanguageModel::MakeAvailableAsync();
            op.Completed([response, prompt](auto asyncInfo, winrt::Windows::Foundation::AsyncStatus asyncStatus) {
                response.Resolve("Phi Silica model has been downloaded. Please reboot your machine to complete installation.");
                });
        }
        else {
            auto createAsync = LanguageModel::CreateAsync();
            createAsync.Completed([createAsync, response, prompt](auto asyncInfo, winrt::Windows::Foundation::AsyncStatus asyncStatus) {
                auto languageModel = createAsync.get();
                auto responseAsync = languageModel.GenerateResponseAsync(winrt::to_hstring(prompt));
                responseAsync.Completed([responseAsync, response](auto asyncInfo, winrt::Windows::Foundation::AsyncStatus asyncStatus) {
                    auto result = responseAsync.get().Response();
                    response.Resolve(winrt::to_string(result));
                    });
                });
        }*/
    }
};

// A PackageProvider containing any turbo modules you define within this app project
struct CompReactPackageProvider
    : winrt::implements<CompReactPackageProvider, winrt::Microsoft::ReactNative::IReactPackageProvider> {
 public: // IReactPackageProvider
  void CreatePackage(winrt::Microsoft::ReactNative::IReactPackageBuilder const &packageBuilder) noexcept {
    AddAttributedModules(packageBuilder, true);
  }
};

// The entry point of the Win32 application
_Use_decl_annotations_ int CALLBACK WinMain(HINSTANCE instance, HINSTANCE, PSTR /* commandLine */, int showCmd) {
  // Initialize WinRT
  winrt::init_apartment(winrt::apartment_type::single_threaded);

  // Enable per monitor DPI scaling
  SetProcessDpiAwarenessContext(DPI_AWARENESS_CONTEXT_PER_MONITOR_AWARE_V2);

  // Find the path hosting the app exe file
  WCHAR appDirectory[MAX_PATH];
  GetModuleFileNameW(NULL, appDirectory, MAX_PATH);
  PathCchRemoveFileSpec(appDirectory, MAX_PATH);

  // Create a ReactNativeWin32App with the ReactNativeAppBuilder
  auto reactNativeWin32App{winrt::Microsoft::ReactNative::ReactNativeAppBuilder().Build()};

  // Configure the initial InstanceSettings for the app's ReactNativeHost
  auto settings{reactNativeWin32App.ReactNativeHost().InstanceSettings()};
  // Register any autolinked native modules
  RegisterAutolinkedNativeModulePackages(settings.PackageProviders());
  // Register any native modules defined within this app project
  settings.PackageProviders().Append(winrt::make<CompReactPackageProvider>());

#if BUNDLE
  // Load the JS bundle from a file (not Metro):
  // Set the path (on disk) where the .bundle file is located
  settings.BundleRootPath(std::wstring(L"file://").append(appDirectory).append(L"\\Bundle\\").c_str());
  // Set the name of the bundle file (without the .bundle extension)
  settings.JavaScriptBundleFile(L"index.windows");
  // Disable hot reload
  settings.UseFastRefresh(false);
#else
  // Load the JS bundle from Metro
  settings.JavaScriptBundleFile(L"index");
  // Enable hot reload
  settings.UseFastRefresh(true);
#endif
#if _DEBUG
  // For Debug builds
  // Enable Direct Debugging of JS
  settings.UseDirectDebugger(true);
  // Enable the Developer Menu
  settings.UseDeveloperSupport(true);
#else
  // For Release builds:
  // Disable Direct Debugging of JS
  settings.UseDirectDebugger(false);
  // Disable the Developer Menu
  settings.UseDeveloperSupport(false);
#endif

  // Get the AppWindow so we can configure its initial title and size
  auto appWindow{reactNativeWin32App.AppWindow()};
  appWindow.Title(L"Windows AI Foundry Sample");
  appWindow.Resize({1000, 1000});
  appWindow.SetTitleBarIcon(L"logo.ico");


  // Get the ReactViewOptions so we can set the initial RN component to load
  auto viewOptions{reactNativeWin32App.ReactViewOptions()};
  viewOptions.ComponentName(L"rnWindowsAIFoundrySample");

  // Start the app
  reactNativeWin32App.Start();
}
