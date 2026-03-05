export function LoginPage() {
  const handleGoogleLogin = () => {
    // 실제 구글 OAuth 로그인 로직이 들어갈 부분
    console.log("구글 로그인 시도");
    // 예: window.location.href = "YOUR_GOOGLE_OAUTH_URL";
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  const handleKakaoLogin = () => {
    // 실제 카카오 OAuth 로그인 로직이 들어갈 부분
    console.log("카카오 로그인 시도");
    // 예: window.location.href = "YOUR_KAKAO_OAUTH_URL";
    window.location.href = "http://localhost:8080/oauth2/authorization/kakao";
  };

  return (
    <div className="min-h-screen bg-white px-4">
      {/* 좌측 상단 로고 */}
      <div className="pt-6 pl-6">
        <h1 className="text-lg font-medium text-gray-700">모기위키</h1>
      </div>
      
      {/* 로그인 폼 중앙 배치 */}
      <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 80px)' }}>
        <div className="w-full max-w-md">
          {/* 로고 또는 타이틀 영역 */}
          <div className="text-center mb-12">
            <h1 className="text-3xl mb-2">로그인</h1>
            <p className="text-gray-600">소셜 계정으로 간편하게 로그인하세요</p>
          </div>

          {/* 로그인 버튼 영역 */}
          <div className="space-y-3">
            {/* 구글 로그인 버튼 */}
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.8 10.2273C19.8 9.51821 19.7364 8.83639 19.6182 8.18182H10.2V12.05H15.6109C15.3773 13.3 14.6573 14.3591 13.5864 15.0682V17.5773H16.8182C18.7091 15.8364 19.8 13.2727 19.8 10.2273Z" fill="#4285F4"/>
                <path d="M10.2 20C12.9 20 15.1709 19.1045 16.8182 17.5773L13.5864 15.0682C12.6909 15.6682 11.5455 16.0227 10.2 16.0227C7.59545 16.0227 5.38182 14.2636 4.58636 11.9H1.24545V14.4909C2.88182 17.7591 6.30909 20 10.2 20Z" fill="#34A853"/>
                <path d="M4.58636 11.9C4.38636 11.3 4.27273 10.6591 4.27273 10C4.27273 9.34091 4.38636 8.7 4.58636 8.1V5.50909H1.24545C0.554545 6.88636 0.163636 8.40909 0.163636 10C0.163636 11.5909 0.554545 13.1136 1.24545 14.4909L4.58636 11.9Z" fill="#FBBC04"/>
                <path d="M10.2 3.97727C11.6727 3.97727 12.9864 4.48182 14.0227 5.47273L16.8909 2.60455C15.1664 0.990909 12.8955 0 10.2 0C6.30909 0 2.88182 2.24091 1.24545 5.50909L4.58636 8.1C5.38182 5.73636 7.59545 3.97727 10.2 3.97727Z" fill="#EA4335"/>
              </svg>
              <span>구글로 로그인</span>
            </button>

            {/* 카카오 로그인 버튼 */}
            <button
              onClick={handleKakaoLogin}
              className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-[#FEE500] rounded-lg hover:bg-[#FDD835] transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M10 3C5.58172 3 2 5.89543 2 9.5C2 11.7832 3.46619 13.7963 5.68058 14.9808L4.75414 18.3413C4.67483 18.6318 4.99827 18.8624 5.24276 18.6845L9.33195 15.8938C9.55191 15.9311 9.77464 15.9576 10 15.9727C10.0073 15.9732 10.0146 15.9736 10.022 15.9741C10.0147 15.9736 10.0073 15.9732 10 15.9727V16C14.4183 16 18 13.1046 18 9.5C18 5.89543 14.4183 3 10 3Z" fill="#181600"/>
              </svg>
              <span className="text-[#181600]">카카오로 로그인</span>
            </button>
          </div>

          {/* 부가 정보 */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>로그인 시 서비스 이용약관 및</p>
            <p>개인정보처리방침에 동의하게 됩니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
