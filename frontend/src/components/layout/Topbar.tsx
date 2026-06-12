import { useLocation } from "react-router-dom"


function captilizeFirstLetter(str: string) {
	const chars = str.split('');
	const uppercaseChars: string[] = [];

	chars.forEach(character => {
		if (character == chars[0]) {
			uppercaseChars.push(character.toUpperCase())
		} else {
			uppercaseChars.push(character)
		}
	});

	return uppercaseChars.join('')
}


export default function Topbar() {

	const currentLocation = useLocation().pathname.split('/')[1];
	let pageTitle = "Overview";

	if ( currentLocation.length > 1 ) {
		pageTitle = captilizeFirstLetter(currentLocation);
	}

	return (
		<>
			<section className="topbar w-full h-12 bg-elevated border-1 border-border">
				<div className="w-full h-full flex justify-between items-center mx-6">
					<h1 className="text-text1">
						{pageTitle}
					</h1>
				</div>
			</section>
		</>
	)
}
